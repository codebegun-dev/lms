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

	
	// ---------------- UPDATE LEAD ----------------
	@Override
	@Transactional
	public SalesCourseManagementResponseDto updateLeadDetails(Long id, SalesCourseManagementRequestDto dto) {

	    User loggedInUser = userRepository.findById(dto.getLoggedInUserId())
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    String loggedInRole = loggedInUser.getRole() != null ?
	            loggedInUser.getRole().getName() : null;

	    boolean isMasterAdmin = "MASTER_ADMIN".equalsIgnoreCase(loggedInRole);
	    boolean isSalesManager = "SALES_MANAGER".equalsIgnoreCase(loggedInRole);

	    SalesCourseManagement lead = salesCourseManagementRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + id));

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

	    // ---------------- UPDATE OPEN FIELDS ----------------
	    if (dto.getLeadName() != null) lead.setLeadName(dto.getLeadName());
	    if (phone != null) lead.setPhone(phone);
	    if (email != null) lead.setEmail(email);
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

	    // ======================================================
	    //       ASSIGNMENT — FIXED (declared outside IF)
	    // ======================================================

	    User assignedUser = null; // 👈 declared here

	    if (dto.getAssignedTo() != null) {

	        // Only Manager + Admin allowed to update assignedTo
	        if (!isMasterAdmin && !isSalesManager) {
	            throw new UnauthorizedActionException(
	                    "Only MasterAdmin or SalesManager can update assignedTo"
	            );
	        }

	        assignedUser = userRepository.findById(dto.getAssignedTo())
	                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

	        String assRole = assignedUser.getRole().getName();

	        boolean allowedTarget =
	                assRole.startsWith("SA_") ||
	                        "MASTER_ADMIN".equalsIgnoreCase(assRole) ||
	                        "SALES_MANAGER".equalsIgnoreCase(assRole);

	        if (!allowedTarget) {
	            throw new UnauthorizedActionException("This user cannot be assigned to a lead");
	        }

	        lead.setAssignedTo(assignedUser);
	    }

	    // ---------------- ALWAYS SET UPDATED META ----------------
	    lead.setAssignedBy(loggedInUser);
	    lead.setAssignedAt(LocalDateTime.now());

	    SalesCourseManagement updated = salesCourseManagementRepository.save(lead);

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

	    if (assignedUserId == null || leadIds == null || leadIds.isEmpty()) {
	        throw new IllegalArgumentException("Lead IDs and Assigned User ID cannot be empty");
	    }

	    if (loggedInUserId == null) {
	        throw new IllegalArgumentException("Logged-in user ID is required for assignment");
	    }

	    // Logged-in user who is performing the assignment
	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    String loggedInRole = loggedInUser.getRole() != null ? loggedInUser.getRole().getName() : null;

	    boolean isMasterAdmin = "MASTER_ADMIN".equalsIgnoreCase(loggedInRole);
	    boolean isSalesManager = "SALES_MANAGER".equalsIgnoreCase(loggedInRole);

	    // ❌ Counsellors (SA_*) not allowed to assign
	    if (!isMasterAdmin && !isSalesManager) {
	        throw new UnauthorizedActionException(
	                "Only MasterAdmin or SalesManager can assign leads"
	        );
	    }

	    // Fetch the user to whom leads will be assigned
	    User assignedUser = userRepository.findById(assignedUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Assigned User not found"));

	    // Assigned user must be SA_ (counsellor) / SalesManager / Admin
	    String assignedRole = assignedUser.getRole() != null ? assignedUser.getRole().getName() : null;
	    boolean validAssignmentTarget =
	            assignedRole != null &&
	            (assignedRole.startsWith("SA_")
	                    || "SALES_MANAGER".equalsIgnoreCase(assignedRole)
	                    || "MASTER_ADMIN".equalsIgnoreCase(assignedRole));

	    if (!validAssignmentTarget) {
	        throw new UnauthorizedActionException("This user cannot be assigned leads");
	    }

	    // Fetch leads
	    List<SalesCourseManagement> leads = salesCourseManagementRepository.findAllById(leadIds);

	    if (leads.isEmpty()) {
	        throw new ResourceNotFoundException("No valid lead IDs provided");
	    }

	    // Bulk assign
	    for (SalesCourseManagement lead : leads) {
	        lead.setAssignedTo(assignedUser);
	        lead.setAssignedBy(loggedInUser);
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


	private User findBestCounsellorForAutoAssign() {

	    // 1️⃣ Fetch only active counsellors (SA_*) — excludes SALES_MANAGER / MASTER_ADMIN
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

	        // Only SA_* allowed
	        if (u.getRole().getName().startsWith("SA_") && load < min) {
	            min = load;
	            best = u;
	        }
	    }

	    return best;
	}


	
	private void autoAssignOnStatusChange(SalesCourseManagement lead, Long loggedInUserId) {

	    // Only assign if status is NEW
	    if (!"NEW".equalsIgnoreCase(lead.getStatus())) {
	        return;
	    }

	    // Pick the best counsellor (SA_*) for assignment
	    User bestUser = findBestCounsellorForAutoAssign();
	    if (bestUser == null) return; // No active counsellors available

	    // Safety check: ensure only SA_* are assigned
	    if (!bestUser.getRole().getName().startsWith("SA_")) {
	        return;
	    }

	    // Assign lead
	    lead.setAssignedTo(bestUser);

	    // Set who performed the assignment
	    if (loggedInUserId != null) {
	        User loggedInUser = userRepository.findById(loggedInUserId)
	                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
	        lead.setAssignedBy(loggedInUser);
	    }

	    lead.setAssignedAt(LocalDateTime.now());

	    // Save the lead with assignment
	    salesCourseManagementRepository.save(lead);
	}

	
	@Override
	@Transactional
	public String rebalanceAssignments(Long loggedInUserId) {

	    // 1️⃣ Fetch only active counsellors (SA_*) — explicitly excludes managers/admins
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

	    // 6️⃣ Apply Round Robin (only SA_*)
	    for (SalesCourseManagement s : newLeads) {
	        User assignTo = counsellors.get(index);

	        s.setAssignedTo(assignTo);
	        s.setAssignedBy(loggedInUser);
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
	
	


	private void validateUserRole(Long loggedInUserId) {
	    if (loggedInUserId == null) {
	        throw new UnauthorizedActionException("Logged-in user ID is required");
	    }

	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    String roleName = loggedInUser.getRole() != null ? loggedInUser.getRole().getName() : null;

	    if (roleName == null || 
	        (!roleName.startsWith("SA_") && !"MASTER_ADMIN".equals(roleName) && !"SALES_MANAGER".equalsIgnoreCase(roleName))) {
	        throw new UnauthorizedActionException(
	            "User (" + loggedInUser.getFirstName() + ") is not authorized to perform this action"
	        );
	    }
	}



}