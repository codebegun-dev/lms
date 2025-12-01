package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mockInterview.entity.CourseManagement;
import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.entity.User;
import com.mockInterview.excelHelper.ExcelHelper;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.exception.UnauthorizedActionException;
import com.mockInterview.mapper.SalesCourseManagementMapper;
import com.mockInterview.repository.CourseManagementRepository;
import com.mockInterview.repository.SalesCourseManagementRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.AssignedCountResponseDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;
import com.mockInterview.service.LeadActivityHistoryService;
import com.mockInterview.service.SalesCourseService;

import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@Service
public class SalesCourseServiceImpl implements SalesCourseService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentPersonalInfoRepository studentPersonalInfoRepository;

    @Autowired
    private SalesCourseManagementRepository salesCourseManagementRepository;

    @Autowired
    private CourseManagementRepository courseManagementRepository;

    @Autowired
    private LeadActivityHistoryService leadActivityHistoryService;

    @Autowired
    private LeadAssignmentService leadAssignmentService;

 // ---------------- CREATE LEAD ----------------
    @Override
    public SalesCourseManagementResponseDto createLead(SalesCourseManagementRequestDto dto) {
        leadAssignmentService.validateUserRole(dto.getLoggedInUserId());

        String email = dto.getEmail() != null ? dto.getEmail().trim() : null;
        String phone = dto.getPhone() != null ? dto.getPhone().trim() : null;

        // --------------------- VALIDATION ---------------------
        if (phone == null || phone.isEmpty()) {
            throw new DuplicateFieldException("Phone is required!");
        }

        if (phone != null && (userRepository.findByPhone(phone) != null
                || studentPersonalInfoRepository.findByParentMobileNumber(phone) != null
                || salesCourseManagementRepository.findByPhone(phone) != null)) {
            throw new DuplicateFieldException("Phone already exists!");
        }

        if (email != null && !email.isEmpty()) {
            if (userRepository.findByEmail(email) != null
                    || salesCourseManagementRepository.findByEmail(email) != null) {
                throw new DuplicateFieldException("Email already exists!");
            }
        }

        // --------------------- FETCH COURSE ---------------------
        CourseManagement course = null;
        if (dto.getCourseId() != null && dto.getCourseId() > 0) {
            course = courseManagementRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found!"));
        }

        // --------------------- CREATE ENTITY ---------------------
        SalesCourseManagement entity = SalesCourseManagementMapper.toEntity(dto, course);
        entity.setPhone(phone);
        if (email != null) entity.setEmail(email);

        // Force unassigned initially
        entity.setAssignedTo(null);
        entity.setAssignedBy(null);
        entity.setAssignedAt(null);

        SalesCourseManagement saved = salesCourseManagementRepository.save(entity);

        // --------------------- AUTO ASSIGN ---------------------
        User newAssignedTo = null;
        if (leadAssignmentService.findBestCounsellorForAutoAssign() != null) {
            newAssignedTo = leadAssignmentService.findBestCounsellorForAutoAssign();
            saved.setAssignedTo(newAssignedTo);

            if (dto.getLoggedInUserId() != null) {
                User loggedInUser = userRepository.findById(dto.getLoggedInUserId())
                        .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
                saved.setAssignedBy(loggedInUser);
            }
            saved.setAssignedAt(LocalDateTime.now());
            salesCourseManagementRepository.save(saved);
        }

     // --------------------- RECORD HISTORY ---------------------
     // Only record if notes or reminder are provided (single creation)
     if ((dto.getNotes() != null && !dto.getNotes().isEmpty()) || dto.getReminderTime() != null) {

         // For creation, oldAssignedTo is null
         User oldAssignedTo = null;

         leadActivityHistoryService.saveHistory(
                 saved,
                 "NEW",                  // oldStatus (NEW for creation)
                 saved.getStatus(),      // newStatus
                 oldAssignedTo,          // oldAssignedTo (null initially)
                 newAssignedTo,          // newAssignedTo (if auto-assigned)
                 dto.getNotes(),         // notes from request
                 dto.getReminderTime(),  // reminder from request
                 dto.getLoggedInUserId() // action performed by
         );
     }

 
        return SalesCourseManagementMapper.toResponseDto(saved);
    }


    // ---------------- UPLOAD LEADS FROM EXCEL ----------------
    @Override
    public Map<String, Object> uploadLeadsFromExcel(MultipartFile file, Long loggedInUserId) {
        leadAssignmentService.validateUserRole(loggedInUserId);

        List<SalesCourseManagementRequestDto> dtos = ExcelHelper.parseExcelFile(file);
        int successCount = 0, failCount = 0;
        List<Map<String, String>> failedRows = new ArrayList<>();

        for (int i = 0; i < dtos.size(); i++) {
            SalesCourseManagementRequestDto dto = dtos.get(i);

            if (dto.getEmail() != null) dto.setEmail(dto.getEmail().trim());
            if (dto.getPhone() != null) dto.setPhone(dto.getPhone().replaceAll("\\D", ""));
            if (dto.getCollege() != null) dto.setCollege(dto.getCollege().trim());
            if (dto.getCity() != null) dto.setCity(dto.getCity().trim());
            if (dto.getSource() != null) dto.setSource(dto.getSource().trim());
            if (dto.getCampaign() != null) dto.setCampaign(dto.getCampaign().trim());

            dto.setLoggedInUserId(loggedInUserId);

            try {
                // Notes and reminder are ignored for bulk upload
                dto.setNotes(null);
                dto.setReminderTime(null);

                createLead(dto);
                successCount++;
            } catch (ConstraintViolationException cve) {
                failCount++;
                StringBuilder sb = new StringBuilder();
                for (ConstraintViolation<?> violation : cve.getConstraintViolations()) {
                    sb.append(violation.getMessage()).append("; ");
                }
                Map<String, String> failInfo = new HashMap<>();
                failInfo.put("row", String.valueOf(i + 2));
                failInfo.put("reason", sb.toString().trim());
                failedRows.add(failInfo);
            } catch (Exception e) {
                failCount++;
                Map<String, String> failInfo = new HashMap<>();
                failInfo.put("row", String.valueOf(i + 2));
                failInfo.put("reason", e.getMessage());
                failedRows.add(failInfo);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("successCount", successCount);
        result.put("failedCount", failCount);
        result.put("failedRows", failedRows);

        return result;
    }

    // ---------------- GET LEAD BY ID ----------------
    @Override
    public SalesCourseManagementResponseDto getLeadsById(Long id) {
        SalesCourseManagement lead = salesCourseManagementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));
        return SalesCourseManagementMapper.toResponseDto(lead);
    }

    @Override
    @Transactional
    public SalesCourseManagementResponseDto updateLeadDetails(Long id, SalesCourseManagementRequestDto dto) {

        // ---------------- FETCH LOGGED-IN USER ----------------
        User loggedInUser = userRepository.findById(dto.getLoggedInUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

        String loggedInRole = loggedInUser.getRole() != null ? loggedInUser.getRole().getName() : null;
        boolean isMasterAdmin = "MASTER_ADMIN".equalsIgnoreCase(loggedInRole);
        boolean isSalesManager = "SALES_MANAGER".equalsIgnoreCase(loggedInRole);

        // ---------------- FETCH LEAD ----------------
        SalesCourseManagement lead = salesCourseManagementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));

        String oldStatus = lead.getStatus();
        User oldAssignedTo = lead.getAssignedTo();  // Previous assignedTo

        // ---------------- DUPLICATE CHECKS ----------------
        validateDuplicateEmailPhone(dto, lead);

        // ---------------- UPDATE FIELDS ----------------
        if (dto.getLeadName() != null) lead.setLeadName(dto.getLeadName());
        if (dto.getPhone() != null) lead.setPhone(dto.getPhone().trim());
        if (dto.getEmail() != null) lead.setEmail(dto.getEmail().trim());
        if (dto.getGender() != null) lead.setGender(dto.getGender());
        if (dto.getPassedOutYear() != null) lead.setPassedOutYear(dto.getPassedOutYear());
        if (dto.getQualification() != null) lead.setQualification(dto.getQualification());
        if (dto.getStatus() != null) lead.setStatus(dto.getStatus().trim());
        if (dto.getCollege() != null) lead.setCollege(dto.getCollege().trim());
        if (dto.getCity() != null) lead.setCity(dto.getCity().trim());
        if (dto.getSource() != null) lead.setSource(dto.getSource().trim());
        if (dto.getCampaign() != null) lead.setCampaign(dto.getCampaign().trim());

        if (dto.getCourseId() != null && dto.getCourseId() > 0) {
            CourseManagement course = courseManagementRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            lead.setCourseManagement(course);
        }

        // ---------------- ASSIGNMENT ----------------
        if (dto.getAssignedTo() != null) {
            if (!isMasterAdmin && !isSalesManager) {
                throw new UnauthorizedActionException("Only MasterAdmin or SalesManager can update assignedTo");
            }

            User requestedAssignedTo = userRepository.findById(dto.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

            String assRole = requestedAssignedTo.getRole().getName();
            boolean allowedTarget = assRole.startsWith("SA_") || "MASTER_ADMIN".equalsIgnoreCase(assRole) || "SALES_MANAGER".equalsIgnoreCase(assRole);
            if (!allowedTarget) throw new UnauthorizedActionException("This user cannot be assigned to a lead");

            // Update only if assignment actually changes
            if (oldAssignedTo == null || oldAssignedTo.getUserId() != requestedAssignedTo.getUserId()) {
                lead.setAssignedTo(requestedAssignedTo);
                lead.setAssignedBy(loggedInUser);
                lead.setAssignedAt(LocalDateTime.now());  
            }
        }

        // ---------------- SAVE LEAD ----------------
        SalesCourseManagement updated = salesCourseManagementRepository.save(lead);

        User newAssignedTo = updated.getAssignedTo();

        // ---------------- SAVE ACTIVITY HISTORY ----------------
        leadActivityHistoryService.saveHistory(
                updated,
                oldStatus,              // oldStatus
                updated.getStatus(),    // newStatus
                oldAssignedTo,          // oldAssignedTo
                newAssignedTo,          // newAssignedTo
                dto.getNotes(),         // notes
                dto.getReminderTime(),  // reminderTime
                loggedInUser.getUserId() // updatedBy
        );

        return SalesCourseManagementMapper.toResponseDto(updated);
    }




   
 // ---------------- BULK STATUS UPDATE ----------------
    @Override
    @Transactional
    public String bulkUpdateStatus(List<Long> leadIds, String status, Long loggedInUserId) {
        leadAssignmentService.validateUserRole(loggedInUserId);

        List<SalesCourseManagement> leads = salesCourseManagementRepository.findAllById(leadIds);
        if (leads.isEmpty()) throw new ResourceNotFoundException("No leads found for the given IDs");

        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

        for (SalesCourseManagement lead : leads) {
            String oldStatus = lead.getStatus();
            User oldAssignedTo = lead.getAssignedTo();   // Before any change

            lead.setStatus(status.trim());

            // Auto-assign if status changed to NEW
            if (!status.equalsIgnoreCase(oldStatus) && "NEW".equalsIgnoreCase(status)) {
                leadAssignmentService.autoAssignOnStatusChange(lead, loggedInUserId);
            }

            // After potential auto-assignment
            User newAssignedTo = lead.getAssignedTo();

            // Record activity history
            leadActivityHistoryService.saveHistory(
                    lead,
                    oldStatus,              // oldStatus
                    status,                 // newStatus
                    oldAssignedTo,          // oldAssignedTo
                    newAssignedTo,          // newAssignedTo
                    "Bulk status update",   // notes
                    null,                   // reminderTime
                    loggedInUser.getUserId()// updatedBy
            );
        }

        salesCourseManagementRepository.saveAll(leads);
        return leads.size() + " leads updated successfully with status: " + status;
    }

    // ---------------- BULK ASSIGN ----------------
    @Override
    @Transactional
    public String bulkAssignLeadsToUser(List<Long> leadIds, Long assignedUserId, Long loggedInUserId) {
        leadAssignmentService.validateUserRole(loggedInUserId);

        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

        User assignedUser = userRepository.findById(assignedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Assigned User not found"));

        List<SalesCourseManagement> leads = salesCourseManagementRepository.findAllById(leadIds);
        if (leads.isEmpty()) throw new ResourceNotFoundException("No valid lead IDs provided");

        leadAssignmentService.bulkAssignLeads(leads, assignedUser, loggedInUser);
        return "Successfully assigned " + leads.size() + " leads to " + assignedUser.getFirstName();
    }

    // ---------------- DELETE LEAD ----------------
    @Override
    public void deleteLead(Long id) {
        SalesCourseManagement lead = salesCourseManagementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));
        salesCourseManagementRepository.delete(lead);
    }

    // ---------------- GET LEADS BY STATUS ----------------
    @Override
    public List<SalesCourseManagementResponseDto> getLeadsByStatus(String status) {
        if (status == null || status.trim().isEmpty()) throw new IllegalArgumentException("Status cannot be empty!");

        List<SalesCourseManagement> leads = salesCourseManagementRepository.findByStatus(status.trim());
        if (leads.isEmpty()) throw new ResourceNotFoundException("No leads found with status: " + status);

        List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
        for (SalesCourseManagement sc : leads) {
            dtoList.add(SalesCourseManagementMapper.toResponseDto(sc));
        }
        return dtoList;
    }

    // ---------------- GET ASSIGNED COUNTS ----------------
    @Override
    public List<AssignedCountResponseDto> getAssignedCountsForCounsellors() {
        List<Object[]> results = salesCourseManagementRepository.getNewLeadCounts();
        List<AssignedCountResponseDto> response = new ArrayList<>();

        for (Object[] row : results) {
            Long counsellorId = (Long) row[0];
            Long assignedCount = (Long) row[1];
            response.add(new AssignedCountResponseDto(counsellorId, assignedCount));
        }
        return response;
    }

    // ---------------- REBALANCE ----------------
    @Override
    @Transactional
    public String rebalanceAssignments(Long loggedInUserId) {
        List<User> counsellors = leadAssignmentService.getActiveCounsellors();
        if (counsellors.isEmpty()) return "No counsellors to rebalance.";

        List<SalesCourseManagement> newLeads = salesCourseManagementRepository.findByStatus("NEW");
        if (newLeads.isEmpty()) return "No NEW leads available.";

        leadAssignmentService.rebalanceAssignments(newLeads, counsellors, loggedInUserId);
        return "Rebalance completed successfully. " + newLeads.size() + " leads distributed equally among " + counsellors.size() + " counsellors.";
    }
    
    @Override
	@Transactional
	public Map<String, Object> getLeadsByRoleWithPagination(Long loggedInUserId, Integer page, Integer size) {

	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    String roleName = loggedInUser.getRole() != null ? loggedInUser.getRole().getName() : null;
	    if (roleName == null) {
	        throw new UnauthorizedActionException("User role not found");
	    }

	    boolean isPaginated = (page != null && size != null);

	    List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
	    Map<String, Object> response = new HashMap<>();

	    Page<SalesCourseManagement> pagedResult = null;
	    List<SalesCourseManagement> fullListForCounts = null;   // ✔ full list for statusCounts

	    // ===============================
	    //    ADMIN / MANAGER
	    // ===============================
	    if ("MASTER_ADMIN".equalsIgnoreCase(roleName) || "SALES_MANAGER".equalsIgnoreCase(roleName)) {

	        // Pagination: fetch only page
	        if (isPaginated) {
	            Pageable pageable = PageRequest.of(page, size);
	            pagedResult = salesCourseManagementRepository.findAll(pageable);

	            for (SalesCourseManagement lead : pagedResult.getContent()) {
	                dtoList.add(SalesCourseManagementMapper.toResponseDto(lead));
	            }
	        } else {
	            List<SalesCourseManagement> list = salesCourseManagementRepository.findAll();
	            for (SalesCourseManagement lead : list) {
	                dtoList.add(SalesCourseManagementMapper.toResponseDto(lead));
	            }
	        }

	        // ✔ FULL LIST (for statusCounts)
	        fullListForCounts = salesCourseManagementRepository.findAll();
	    }

	    // ===============================
	    //    COUNSELLOR (SA_XXX)
	    // ===============================
	    else if (roleName.startsWith("SA_")) {

	        // Pagination: fetch only page
	        if (isPaginated) {
	            Pageable pageable = PageRequest.of(page, size);
	            pagedResult = salesCourseManagementRepository.findByAssignedTo_UserId(loggedInUserId, pageable);

	            for (SalesCourseManagement lead : pagedResult.getContent()) {
	                dtoList.add(SalesCourseManagementMapper.toResponseDto(lead));
	            }
	        } else {
	            List<SalesCourseManagement> list = salesCourseManagementRepository.findByAssignedTo_UserId(loggedInUserId);
	            for (SalesCourseManagement lead : list) {
	                dtoList.add(SalesCourseManagementMapper.toResponseDto(lead));
	            }
	        }

	        // ✔ FULL LIST for STATUS COUNTS
	        fullListForCounts = salesCourseManagementRepository.findByAssignedTo_UserId(loggedInUserId);
	    }

	    // ===============================
	    //   INVALID USER ROLE
	    // ===============================
	    else {
	        throw new UnauthorizedActionException(
	                "User (" + loggedInUser.getFirstName() + ") is not authorized to view leads"
	        );
	    }

	    // ===============================
	    //   STATUS COUNTS FROM FULL LIST
	    // ===============================
	    Map<String, Long> statusCounts = new HashMap<>();

	    for (SalesCourseManagement lead : fullListForCounts) {
	        String status = lead.getStatus();
	        statusCounts.put(status, statusCounts.getOrDefault(status, 0L) + 1);
	    }

	    // ===============================
	    //      BUILD RESPONSE
	    // ===============================
	    response.put("leads", dtoList);
	    response.put("statusCounts", statusCounts);   // ✔ full list counts

	    if (pagedResult != null) {
	        response.put("currentPage", pagedResult.getNumber());
	        response.put("totalLeads", pagedResult.getTotalElements());
	        response.put("totalPages", pagedResult.getTotalPages());
	    } else {
	        response.put("totalLeads", dtoList.size());
	        response.put("totalPages", 1);
	    }

	    return response;
	}
    
    private void validateDuplicateEmailPhone(SalesCourseManagementRequestDto dto, SalesCourseManagement lead) {
        String phone = dto.getPhone() != null ? dto.getPhone().trim() : null;
        String email = dto.getEmail() != null ? dto.getEmail().trim() : null;

         if (phone != null && !phone.isEmpty()) {
            SalesCourseManagement phoneCheck = salesCourseManagementRepository.findByPhone(phone);
            if (phoneCheck != null && !phoneCheck.getLeadId().equals(lead.getLeadId())) {
                throw new DuplicateFieldException("Phone already exists!");
            }
            if (userRepository.findByPhone(phone) != null
                    || studentPersonalInfoRepository.findByParentMobileNumber(phone) != null) {
                throw new DuplicateFieldException("Phone exists in User/Parent!");
            }
        }

        if (email != null && !email.isEmpty()) {
            SalesCourseManagement emailCheck = salesCourseManagementRepository.findByEmail(email);
            if (emailCheck != null && !emailCheck.getLeadId().equals(lead.getLeadId())) {
                throw new DuplicateFieldException("Email already exists!");
            }
            if (userRepository.findByEmail(email) != null) {
                throw new DuplicateFieldException("Email exists in User table!");
            }
        }
    }

}
