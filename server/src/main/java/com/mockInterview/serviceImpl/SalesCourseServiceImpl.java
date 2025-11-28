package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import org.springframework.beans.factory.annotation.Autowired;
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

	// ---------------- CREATE LEAD ----------------
	@Override
	public SalesCourseManagementResponseDto createLead(SalesCourseManagementRequestDto dto) {
		validateUserRole(dto.getLoggedInUserId());
	    // --------------------- CLEAN INPUTS ---------------------
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

	    // --------------------- CREATE ENTITY (MAPPER) ---------------------
	    SalesCourseManagement entity = SalesCourseManagementMapper.toEntity(dto, course);

	    entity.setPhone(phone);
	    if (email != null && !email.isEmpty()) {
	        entity.setEmail(email);
	    }

	    // ❗ FORCE UNASSIGNED (ignore incoming assignedUserId)
	    entity.setAssignedTo(null);
	    entity.setAssignedBy(null);          // optional
	    entity.setAssignedAt(null);          // optional

	    // --------------------- SAVE WITHOUT ASSIGNMENT ---------------------
	    SalesCourseManagement saved = salesCourseManagementRepository.save(entity);

	    // ===========================================================
	    //    AUTO ASSIGN STARTS — ROUND ROBIN BASED ON NEW STATUS
	    // ===========================================================
	    User bestUser = findBestCounsellorForAutoAssign();

	    if (bestUser != null) {
	        saved.setAssignedTo(bestUser);

	        Long loggedInUserId = dto.getLoggedInUserId(); 
	        if (loggedInUserId != null) {
	            User loggedInUser = userRepository.findById(loggedInUserId)
	                    .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
	            saved.setAssignedBy(loggedInUser); // ✅ store User entity
	        }

	        saved.setAssignedAt(LocalDateTime.now());
	        salesCourseManagementRepository.save(saved);
	    }

	    // ===========================================================

	    return SalesCourseManagementMapper.toResponseDto(saved);
	}
	
	@Override
	public Map<String, Object> uploadLeadsFromExcel(MultipartFile file, Long loggedInUserId)
 {
		validateUserRole(loggedInUserId);
		List<SalesCourseManagementRequestDto> dtos = ExcelHelper.parseExcelFile(file);

		int successCount = 0;
		int failCount = 0;
		List<Map<String, String>> failedRows = new ArrayList<>();

		for (int i = 0; i < dtos.size(); i++) {

			SalesCourseManagementRequestDto dto = dtos.get(i);

			// ----------- CLEAN DATA -----------
			if (dto.getEmail() != null)
				dto.setEmail(dto.getEmail().trim());

			if (dto.getPhone() != null) {
				dto.setPhone(dto.getPhone().replaceAll("\\D", ""));
			}

			if (dto.getCollege() != null)
				dto.setCollege(dto.getCollege().trim());
			if (dto.getCity() != null)
				dto.setCity(dto.getCity().trim());
			if (dto.getSource() != null)
				dto.setSource(dto.getSource().trim());
			if (dto.getCampaign() != null)
				dto.setCampaign(dto.getCampaign().trim());

			// ❗ FORCE UNASSIGNED (ignore assignedUserId from Excel)
			dto.setLoggedInUserId(loggedInUserId); // ❌ invalid


			try {
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
		SalesCourseManagement lead= salesCourseManagementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("lead not found with ID: " + id));
		return SalesCourseManagementMapper.toResponseDto(lead);
	}

	// ---------------- GET ALL LEADS ----------------
	@Override
	public List<SalesCourseManagementResponseDto> getAllLeads() {
		List<SalesCourseManagement> leads = salesCourseManagementRepository.findAll();
		List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
		for (SalesCourseManagement lead : leads) {
			dtoList.add(SalesCourseManagementMapper.toResponseDto(lead));
		}
		return dtoList;
	}

	// ---------------- UPDATE LEAD ----------------
	@Override
	public SalesCourseManagementResponseDto updateLeadDetails(Long id, SalesCourseManagementRequestDto dto) {
		validateUserRole(dto.getLoggedInUserId());
	    SalesCourseManagement lead = salesCourseManagementRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("lead not found with ID: " + id));

	    String email = dto.getEmail() != null ? dto.getEmail().trim() : null;
	    String phone = dto.getPhone() != null ? dto.getPhone().trim() : null;

	    // ---------------- DUPLICATE CHECKS ----------------
	    if (phone != null && !phone.isEmpty()) {
	        SalesCourseManagement phoneCheck = salesCourseManagementRepository.findByPhone(phone);
	        if (phoneCheck != null && !phoneCheck.getLeadId().equals(id)) {
	            throw new DuplicateFieldException("Phone already exists!");
	        }
	        if (userRepository.findByPhone(phone) != null
	                || studentPersonalInfoRepository.findByParentMobileNumber(phone) != null) {
	            throw new DuplicateFieldException("Phone exists in User/Parent!");
	        }
	    }

	    if (email != null && !email.isEmpty()) {
	        SalesCourseManagement emailCheck = salesCourseManagementRepository.findByEmail(email);
	        if (emailCheck != null && !emailCheck.getLeadId().equals(id)) {
	            throw new DuplicateFieldException("Email already exists!");
	        }
	        if (userRepository.findByEmail(email) != null) {
	            throw new DuplicateFieldException("Email exists in User table!");
	        }
	    }

	    // ---------------- COURSE UPDATE ----------------
	    if (dto.getCourseId() != null && dto.getCourseId() > 0) {
	        CourseManagement course = courseManagementRepository.findById(dto.getCourseId())
	                .orElseThrow(() -> new ResourceNotFoundException("Course not found!"));
	        lead.setCourseManagement(course);
	    }

	    // ---------------- MAIN FIELDS ----------------
	    if (dto.getLeadName() != null) lead.setLeadName(dto.getLeadName());
	    if (phone != null && !phone.isEmpty()) lead.setPhone(phone);
	    if (email != null && !email.isEmpty()) lead.setEmail(email);
	    if (dto.getGender() != null) lead.setGender(dto.getGender());
	    if (dto.getPassedOutYear() != null) lead.setPassedOutYear(dto.getPassedOutYear());
	    if (dto.getQualification() != null) lead.setQualification(dto.getQualification());

	    // Capture OLD status before updating
	    String oldStatus = lead.getStatus();

	    if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty())
	    	lead.setStatus(dto.getStatus().trim());

	    // ---------------- OPTIONAL FIELDS ----------------
	    if (dto.getCollege() != null) lead.setCollege(dto.getCollege().trim());
	    if (dto.getCity() != null) lead.setCity(dto.getCity().trim());
	    if (dto.getSource() != null) lead.setSource(dto.getSource().trim());
	    if (dto.getCampaign() != null) lead.setCampaign(dto.getCampaign().trim());

	    // ===========================================================
	    //        🔥 USER ASSIGNMENT RESTRICTION (Manual Assignment)
	    // ===========================================================
	    if (dto.getLoggedInUserId() != null) {

	        User assignedUser = userRepository.findById(dto.getLoggedInUserId())
	                .orElseThrow(() -> new ResourceNotFoundException("Assigned User not found"));

	        String roleName = assignedUser.getRole() != null ? assignedUser.getRole().getName() : null;

	        boolean isSalesRole = roleName != null && roleName.startsWith("SA_");
	        boolean isMasterAdmin = "MASTER_ADMIN".equals(roleName);

	        if (!isSalesRole && !isMasterAdmin) {
	            throw new UnauthorizedActionException(
	                    "This user (" + assignedUser.getFirstName() + ") cannot be assigned to a lead");
	        }

	        // Valid manual assignment
	        lead.setAssignedTo(assignedUser);
	     // Suppose frontend sends the logged-in user's ID in DTO
	        Long loggedInUserId = dto.getLoggedInUserId();

	        User loggedInUser = userRepository.findById(loggedInUserId)
	                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	        // Assign to lead
	        lead.setAssignedBy(loggedInUser);  // ✅ stores the User entity
	        lead.setAssignedAt(LocalDateTime.now());

	        

	    } else {
	    	lead.setAssignedTo(null);
	        lead.setAssignedBy(null);
	        lead.setAssignedAt(null);
	    }

	    // Save update
	    SalesCourseManagement updated = salesCourseManagementRepository.save(lead);

	    // ===========================================================
	    //      🔥 AUTO-ASSIGN WHEN STATUS CHANGES → NEW
	    // ===========================================================
	    if (!oldStatus.equalsIgnoreCase(updated.getStatus())
	            && "NEW".equalsIgnoreCase(updated.getStatus())) {

	    	autoAssignOnStatusChange(updated, dto.getLoggedInUserId());

	    }

	    return SalesCourseManagementMapper.toResponseDto(updated);
	}
	
	
	@Override
	 @Transactional
	public String bulkUpdateStatus(List<Long> leadIds, String status, Long loggedInUserId) {
		validateUserRole(loggedInUserId);
	    if (leadIds == null || leadIds.isEmpty()) {
	        throw new IllegalArgumentException("lead IDs cannot be empty");
	    }

	    if (status == null || status.trim().isEmpty()) {
	        throw new IllegalArgumentException("Status cannot be empty");
	    }

	    if (loggedInUserId == null) {
	        throw new IllegalArgumentException("Logged-in user ID is required for assignment");
	    }

	    List<SalesCourseManagement> leads = salesCourseManagementRepository.findAllById(leadIds);

	    if (leads.isEmpty()) {
	        throw new ResourceNotFoundException("No leads found for the given IDs");
	    }

	    List<SalesCourseManagement> leadsToSave = new ArrayList<>();

	    for (SalesCourseManagement lead : leads) {
	        String oldStatus = lead.getStatus();

	        // Update only status
	        lead.setStatus(status.trim());
	        leadsToSave.add(lead);

	        // Auto-assign if status changed to NEW
	        if (!status.equalsIgnoreCase(oldStatus) && "NEW".equalsIgnoreCase(status)) {
	            autoAssignOnStatusChange(lead, loggedInUserId); // ✅ saves internally
	        }
	    }

	    // Batch save remaining leads (excluding auto-assigned ones if already saved)
	    salesCourseManagementRepository.saveAll(leadsToSave);

	    return leadsToSave.size() + " leads updated successfully with status: " + status;
	}


	
	
	@Override
	@Transactional
	public String bulkAssignLeadsToUser(List<Long> leadIds, Long assignedUserId, Long loggedInUserId) {
		validateUserRole(loggedInUserId);
	    if (assignedUserId == null || leadIds == null ||leadIds.isEmpty()) {
	        throw new IllegalArgumentException("Lead IDs and Assigned User ID cannot be empty");
	    }

	    if (loggedInUserId == null) {
	        throw new IllegalArgumentException("Logged-in user ID is required for assignment");
	    }

	    User assignedUser = userRepository.findById(assignedUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Assigned User not found"));

	    // ROLE VALIDATION
	    String roleName = assignedUser.getRole() != null ? assignedUser.getRole().getName() : null;
	    boolean isSalesRole = roleName != null && roleName.startsWith("SA_");
	    boolean isMasterAdmin = "MASTER_ADMIN".equals(roleName);

	    if (!isSalesRole && !isMasterAdmin) {
	        throw new UnauthorizedActionException(
	                "This user (" + assignedUser.getFirstName() + ") cannot be assigned to leads"
	        );
	    }

	    // FETCH LEADS
	    List<SalesCourseManagement> leads = salesCourseManagementRepository.findAllById(leadIds);

	    if (leads.isEmpty()) {
	        throw new ResourceNotFoundException("No valid lead IDs provided");
	    }

	    // FETCH LOGGED-IN USER
	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    // BULK ASSIGN
	    for (SalesCourseManagement lead : leads) {
	    	lead.setAssignedTo(assignedUser);
	    	lead.setAssignedBy(loggedInUser);  // ✅ store who performed assignment
	    	lead.setAssignedAt(LocalDateTime.now());
	    }

	    salesCourseManagementRepository.saveAll(leads);

	    return "Successfully assigned " + leads.size() + " leads to " + assignedUser.getFirstName();
	}



	// ---------------- DELETE LEAD ----------------
	@Override
	public void deleteLead(Long id) {
		SalesCourseManagement lead = salesCourseManagementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("lead not found with ID: " + id));
		salesCourseManagementRepository.delete(lead);
	}

	// ---------------- GET LEADS BY STATUS ----------------
	@Override
	public List<SalesCourseManagementResponseDto> getLeadsByStatus(String status) {

		if (status == null || status.trim().isEmpty()) {
			throw new IllegalArgumentException("Status cannot be empty!");
		}

		List<SalesCourseManagement> leads = salesCourseManagementRepository.findByStatus(status.trim());
		if (leads.isEmpty()) {
			throw new ResourceNotFoundException("No leads found with status: " + status);
		}

		List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
		for (SalesCourseManagement sc : leads) {
			dtoList.add(SalesCourseManagementMapper.toResponseDto(sc));
		}
		return dtoList;
	}

	@Override
	 @Transactional
	public Map<String, Object> getLeadsWithPagination(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);

		Page<SalesCourseManagement> pagedResult = salesCourseManagementRepository.findAll(pageable);

		List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
		for (SalesCourseManagement lead : pagedResult.getContent()) {
			dtoList.add(SalesCourseManagementMapper.toResponseDto(lead));
		}

		Map<String, Object> response = new HashMap<>();
		response.put("leads", dtoList);
		response.put("currentPage", pagedResult.getNumber());
		response.put("totalItems", pagedResult.getTotalElements());
		response.put("totalPages", pagedResult.getTotalPages());

		return response;
	}
	
	private User findBestCounsellorForAutoAssign() {

	    // 1️⃣ Fetch all active counsellors
	    List<User> counsellors = userRepository
	            .findByRole_NameStartingWithAndStatus("SA_", "ACTIVE");

	    if (counsellors.isEmpty()) {
	        return null;
	    }

	    // 2️⃣ Fetch load counts (only NEW leads)
	    List<Object[]> counts = salesCourseManagementRepository.getNewLeadCounts();

	    Map<Long, Long> loadMap = new HashMap<>();

	    for (Object[] row : counts) {
	        Long userId = (Long) row[0];
	        Long cnt = (Long) row[1];
	        loadMap.put(userId, cnt);
	    }

	    // 3️⃣ Pick counsellor with lowest NEW lead count
	    User best = null;
	    long min = Long.MAX_VALUE;

	    for (User u : counsellors) {
	        long load = loadMap.getOrDefault(u.getUserId(), 0L);

	        if (load < min) {
	            min = load;
	            best = u;
	        }
	    }

	    return best;
	}


	
	private void autoAssignOnStatusChange(SalesCourseManagement lead, Long loggedInUserId) {

	    if (!"NEW".equalsIgnoreCase(lead.getStatus())) {
	        return;
	    }

	    User bestUser = findBestCounsellorForAutoAssign();
	    if (bestUser == null) return;

	    lead.setAssignedTo(bestUser);

	    if (loggedInUserId != null) {
	        User loggedInUser = userRepository.findById(loggedInUserId)
	                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
	        lead.setAssignedBy(loggedInUser); // ✅ store User entity
	    }

	    lead.setAssignedAt(LocalDateTime.now());
	    salesCourseManagementRepository.save(lead);
	}

	
	@Override
	 @Transactional
	public String rebalanceAssignments(Long loggedInUserId) {

	    // 1️⃣ Fetch counsellors
	    List<User> counsellors = userRepository
	            .findByRole_NameStartingWithAndStatus("SA_", "ACTIVE");

	    if (counsellors.isEmpty()) {
	        return "No counsellors to rebalance.";
	    }

	    // 2️⃣ Fetch NEW leads only
	    List<SalesCourseManagement> newLeads =
	            salesCourseManagementRepository.findByStatus("NEW");

	    if (newLeads.isEmpty()) {
	        return "No NEW leads available.";
	    }

	    // 3️⃣ Sort counsellors by ID for stable distribution
	    counsellors.sort((a, b) -> Long.compare(a.getUserId(), b.getUserId()));

	    int cCount = counsellors.size();
	    int index = 0;

	    // 4️⃣ Fetch logged-in user entity
	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    // 5️⃣ Clear all NEW lead assignments before reassigning
	    for (SalesCourseManagement s : newLeads) {
	        s.setAssignedTo(null);
	    }

	    // 6️⃣ Apply Round Robin (Equal Distribution)
	    for (SalesCourseManagement s : newLeads) {
	        User assignTo = counsellors.get(index);

	        s.setAssignedTo(assignTo);
	        s.setAssignedBy(loggedInUser); // ✅ stores the logged-in user entity
	        s.setAssignedAt(LocalDateTime.now());

	        index = (index + 1) % cCount;
	    }

	    salesCourseManagementRepository.saveAll(newLeads);

	    return "Rebalance completed successfully. "
	            + newLeads.size() + " leads distributed equally among "
	            + cCount + " counsellors.";
	}

	@Override
	 @Transactional
	public List<AssignedCountResponseDto> getAssignedCountsForCounsellors() {

	    // Fetch counts only for NEW status leads 
	    List<Object[]> results = salesCourseManagementRepository.getNewLeadCounts();

	    List<AssignedCountResponseDto> response = new ArrayList<>();

	    for (Object[] row : results) {
	        Long counsellorId = (Long) row[0];
	        Long assignedCount = (Long) row[1];

	        response.add(new AssignedCountResponseDto(counsellorId, assignedCount));
	    }

	    return response;
	}
	
	@Override
	public List<SalesCourseManagementResponseDto> getLeadsAssignedToUser(Long userId) {
	    List<SalesCourseManagement> leads = salesCourseManagementRepository.findByAssignedTo_UserId(userId);
	    List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
	    for (SalesCourseManagement s : leads) {
	        dtoList.add(SalesCourseManagementMapper.toResponseDto(s));
	    }
	    return dtoList;
	}

	private void validateUserRole(Long loggedInUserId) {
	    if (loggedInUserId == null) {
	        throw new UnauthorizedActionException("Logged-in user ID is required");
	    }

	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    String roleName = loggedInUser.getRole() != null ? loggedInUser.getRole().getName() : null;

	    if (roleName == null || 
	        (!roleName.startsWith("SA_") && !"MASTER_ADMIN".equals(roleName))) {
	        throw new UnauthorizedActionException(
	            "User (" + loggedInUser.getFirstName() + ") is not authorized to perform this action"
	        );
	    }
	}



}