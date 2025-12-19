package com.mockInterview.serviceImpl;

import com.mockInterview.entity.*;
import com.mockInterview.mapper.SalesCourseManagementMapper;
import com.mockInterview.repository.*;

import com.mockInterview.requestDtos.BulkLeadStatusUpdateRequestDto;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;

import com.mockInterview.responseDtos.BulkUploadResponseDto;
import com.mockInterview.responseDtos.LeadsDashboardResponseDto;
import com.mockInterview.service.AutoAssignLeadService;
import com.mockInterview.service.SalesCourseManagementService;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@Transactional
public class SalesCourseManagementServiceImpl implements SalesCourseManagementService {

    private final SalesCourseManagementRepository leadRepo;
    private final CourseManagementRepository courseRepo;
    private final SourceRepository sourceRepo;
    private final CampaignRepository campaignRepo;
    private final UserRepository userRepo;

    public SalesCourseManagementServiceImpl(
            SalesCourseManagementRepository leadRepo,
            CourseManagementRepository courseRepo,
            SourceRepository sourceRepo,
            CampaignRepository campaignRepo,
            UserRepository userRepo) {
        this.leadRepo = leadRepo;
        this.courseRepo = courseRepo;
        this.sourceRepo = sourceRepo;
        this.campaignRepo = campaignRepo;
        this.userRepo = userRepo;
    }
    
    @Autowired
    private AutoAssignLeadService autoAssignLeadService;


 // ================= SINGLE LEAD CREATION =================
    @Override
    public SalesCourseManagementResponseDto createLead(SalesCourseManagementRequestDto dto) {

        String email = dto.getEmail();
        String phone = dto.getPhone();

        // ================= VALIDATE DUPLICATES IN LEADS =================
        if (email != null && leadRepo.existsByEmail(email)) {
            throw new DuplicateFieldException("Email already exists in Leads table");
        }
        if (phone != null && leadRepo.existsByPhone(phone)) {
            throw new DuplicateFieldException("Phone already exists in Leads table");
        }

        // ================= VALIDATE DUPLICATES IN USERS =================
        if (email != null && userRepo.existsByEmail(email)) {
            throw new DuplicateFieldException("Email already exists in Users table");
        }
        if (phone != null && userRepo.existsByPhone(phone)) {
            throw new DuplicateFieldException("Phone already exists in Users table");
        }

        // ================= FETCH COURSE (OPTIONAL) =================
        CourseManagement course = null;
        if (dto.getCourseId() != null) {
            course = courseRepo.findById(dto.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Course not found with ID: " + dto.getCourseId()
                    ));
        }

        // ================= MAP TO ENTITY =================
        SalesCourseManagement lead = SalesCourseManagementMapper.toEntity(dto, course);

        // ================= OPTIONAL SOURCE =================
        if (dto.getSourceId() != null) {
            Source source = sourceRepo.findById(dto.getSourceId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Source not found with ID: " + dto.getSourceId()
                    ));
            lead.setSource(source);
        }

        // ================= OPTIONAL CAMPAIGN =================
        if (dto.getCampaignId() != null) {
            Campaign campaign = campaignRepo.findById(dto.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Campaign not found with ID: " + dto.getCampaignId()
                    ));
            lead.setCampaign(campaign);
        }

        // ================= OPTIONAL ASSIGNMENT =================
        if (dto.getAssignedTo() != null) {
            User counselor = userRepo.findById(dto.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Assigned user not found with ID: " + dto.getAssignedTo()
                    ));
            lead.setAssignedTo(counselor);
            lead.setAssignedAt(LocalDateTime.now());
        }

        // ================= SAVE LEAD =================
        lead = leadRepo.save(lead);
        
     // ✅ AUTO ASSIGN ONLY IF NOT MANUALLY ASSIGNED
        if (lead.getAssignedTo() == null) {
            autoAssignLeadService.autoAssignLeads();
        }

        // ================= MAP TO RESPONSE DTO =================
        return SalesCourseManagementMapper.toResponseDto(lead);
    }

    // ================= BULK LEAD CREATION =================
    @Override
    public BulkUploadResponseDto createLeadsBulk(List<SalesCourseManagementRequestDto> dtos) {

        List<SalesCourseManagement> leadsToSave = new ArrayList<>();
        List<BulkUploadResponseDto.RowError> errors = new ArrayList<>();

        // Preload existing emails & phones
        List<String> existingLeadEmails = leadRepo.findAllEmails();
        List<String> existingLeadPhones = leadRepo.findAllPhones();
        List<String> existingUserEmails = userRepo.findAllEmails();
        List<String> existingUserPhones = userRepo.findAllPhones();

        int rowNumber = 1; // assuming first row = 1
        for (SalesCourseManagementRequestDto dto : dtos) {
            try {
                String email = dto.getEmail();
                String phone = dto.getPhone();

                // ===== Duplicate check =====
                if (email != null && (existingLeadEmails.contains(email) || existingUserEmails.contains(email))) {
                    throw new DuplicateFieldException("Email already exists: " + email);
                }
                if (phone != null && (existingLeadPhones.contains(phone) || existingUserPhones.contains(phone))) {
                    throw new DuplicateFieldException("Phone already exists: " + phone);
                }

                // ===== Fetch course =====
                CourseManagement course = null;
                if (dto.getCourseId() != null) {
                    course = courseRepo.findById(dto.getCourseId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Course not found with ID: " + dto.getCourseId()
                            ));
                }

                // ===== Map to entity =====
                SalesCourseManagement lead = SalesCourseManagementMapper.toEntity(dto, course);

                // ===== Optional source =====
                if (dto.getSourceId() != null) {
                    Source source = sourceRepo.findById(dto.getSourceId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Source not found with ID: " + dto.getSourceId()
                            ));
                    lead.setSource(source);
                }

                // ===== Optional campaign =====
                if (dto.getCampaignId() != null) {
                    Campaign campaign = campaignRepo.findById(dto.getCampaignId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Campaign not found with ID: " + dto.getCampaignId()
                            ));
                    lead.setCampaign(campaign);
                }

                // ===== Optional assignment =====
                if (dto.getAssignedTo() != null) {
                    User user = userRepo.findById(dto.getAssignedTo())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Assigned user not found with ID: " + dto.getAssignedTo()
                            ));
                    lead.setAssignedTo(user);
                    lead.setAssignedAt(LocalDateTime.now());
                }

                leadsToSave.add(lead);

                // Add to memory to prevent duplicates in same batch
                if (email != null) existingLeadEmails.add(email);
                if (phone != null) existingLeadPhones.add(phone);

            } catch (Exception e) {
                errors.add(new BulkUploadResponseDto.RowError(rowNumber, e.getMessage()));
            }
            rowNumber++;
        }

        leadRepo.saveAll(leadsToSave);
        
        autoAssignLeadService.autoAssignLeads();

        BulkUploadResponseDto report = new BulkUploadResponseDto();
        report.setTotalRows(dtos.size());
        report.setSuccessCount(leadsToSave.size());
        report.setFailedCount(errors.size());
        report.setErrors(errors);

        return report;
    }
    
    
   
    @Override
    public LeadsDashboardResponseDto getAllLeadsDashboard(int page, int pageSize) {

        Pageable pageable = PageRequest.of(page, pageSize);

        // 1️⃣ Fetch paginated leads using new method
        Page<SalesCourseManagement> leadsPage = leadRepo.findAllLeadsPaginated(pageable);

        // 2️⃣ Total leads count
        Long totalLeads = leadRepo.countAllLeads();

        // 3️⃣ Status wise count
        List<Object[]> rawStatusData = leadRepo.countLeadsByStatus();
        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] row : rawStatusData) {
            statusCounts.put(String.valueOf(row[0]), (Long) row[1]);
        }

        // 4️⃣ Assigned users count
        Long assignedUsersCount = leadRepo.countAssignedUsers();

        // 5️⃣ Map paginated leads to DTOs
        List<SalesCourseManagementResponseDto> leadDtos = new ArrayList<>();
        for (SalesCourseManagement lead : leadsPage.getContent()) {
            leadDtos.add(SalesCourseManagementMapper.toResponseDto(lead));
        }

        // 6️⃣ Build response
        LeadsDashboardResponseDto response = new LeadsDashboardResponseDto();
        response.setTotalLeads(totalLeads);
        response.setAssignedUsersCount(assignedUsersCount);
        response.setStatusCounts(statusCounts);
        response.setLeadsList(leadDtos);

        // 7️⃣ Pagination info
        response.setCurrentPage(page);
        response.setPageSize(pageSize);
        response.setTotalPages(leadsPage.getTotalPages());

        return response;
    }

   
    
    @Override
    public SalesCourseManagementResponseDto updateLead(Long leadId, SalesCourseManagementRequestDto dto) {

        SalesCourseManagement lead = leadRepo.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Lead not found with ID: " + leadId
                ));

        // ===== EMAIL =====
        if (dto.getEmail() != null && !dto.getEmail().equals(lead.getEmail())) {

            if (leadRepo.existsByEmail(dto.getEmail()))
                throw new DuplicateFieldException("Email already exists in Leads");

            if (userRepo.existsByEmail(dto.getEmail()))
                throw new DuplicateFieldException("Email already exists in Users");

            lead.setEmail(dto.getEmail());
        }

        // ===== PHONE =====
        if (dto.getPhone() != null && !dto.getPhone().equals(lead.getPhone())) {

            if (leadRepo.existsByPhone(dto.getPhone()))
                throw new DuplicateFieldException("Phone already exists in Leads");

            if (userRepo.existsByPhone(dto.getPhone()))
                throw new DuplicateFieldException("Phone already exists in Users");

            lead.setPhone(dto.getPhone());
        }

        // ===== BASIC FIELDS =====
        if (dto.getLeadName() != null) lead.setLeadName(dto.getLeadName());
        if (dto.getGender() != null) lead.setGender(dto.getGender());
        if (dto.getQualification() != null) lead.setQualification(dto.getQualification());
        if (dto.getPassedOutYear() != null) lead.setPassedOutYear(dto.getPassedOutYear());
        if (dto.getCollege() != null) lead.setCollege(dto.getCollege());
        if (dto.getCity() != null) lead.setCity(dto.getCity());
        if (dto.getStatus() != null) lead.setStatus(dto.getStatus());

        // ===== COURSE =====
        if (dto.getCourseId() != null) {
            CourseManagement course = courseRepo.findById(dto.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            lead.setCourseManagement(course);
        }

        // ===== SOURCE =====
        if (dto.getSourceId() != null) {
            Source source = sourceRepo.findById(dto.getSourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source not found"));
            lead.setSource(source);
        }

        // ===== CAMPAIGN =====
        if (dto.getCampaignId() != null) {
            Campaign campaign = campaignRepo.findById(dto.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
            lead.setCampaign(campaign);
        }

        // ===== ASSIGNMENT =====
        if (dto.getAssignedTo() != null) {
            User user = userRepo.findById(dto.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (lead.getAssignedTo() == null ||
                    !lead.getAssignedTo().getUserId().equals(dto.getAssignedTo())) {

                lead.setAssignedTo(user);
                lead.setAssignedAt(LocalDateTime.now());
            }
        }

        SalesCourseManagement updated = leadRepo.save(lead);
        return SalesCourseManagementMapper.toResponseDto(updated);
    }


    
    @Override
    @Transactional
    public void bulkUpdateLeadStatus(BulkLeadStatusUpdateRequestDto dto) {

        List<Long> leadIds = dto.getLeadIds();
        String newStatus = dto.getStatus();

        if (leadIds == null || leadIds.isEmpty()) {
            throw new ResourceNotFoundException("Lead IDs list cannot be empty");
        }

        // 1️⃣ Fetch all leads by IDs
        List<SalesCourseManagement> leads = leadRepo.findAllById(leadIds);

        if (leads.isEmpty()) {
            throw new ResourceNotFoundException("No leads found for given IDs");
        }

        // 2️⃣ Update ONLY status
        for (SalesCourseManagement lead : leads) {
            lead.setStatus(newStatus);
        }

        // 3️⃣ Save in bulk
        leadRepo.saveAll(leads);
    }
    
    
    


}
