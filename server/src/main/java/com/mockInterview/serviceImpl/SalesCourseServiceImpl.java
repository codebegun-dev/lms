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

	// ---------------- CREATE STUDENT ----------------
	@Override
	public SalesCourseManagementResponseDto createStudent(SalesCourseManagementRequestDto dto) {

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
	public Map<String, Object> uploadStudentsFromExcel(MultipartFile file, Long loggedInUserId)
 {

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
				createStudent(dto);
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

	// ---------------- GET STUDENT BY ID ----------------
	@Override
	public SalesCourseManagementResponseDto getStudentsById(Long id) {
		SalesCourseManagement student = salesCourseManagementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
		return SalesCourseManagementMapper.toResponseDto(student);
	}

	// ---------------- GET ALL STUDENTS ----------------
	@Override
	public List<SalesCourseManagementResponseDto> getAllStudents() {
		List<SalesCourseManagement> students = salesCourseManagementRepository.findAll();
		List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
		for (SalesCourseManagement student : students) {
			dtoList.add(SalesCourseManagementMapper.toResponseDto(student));
		}
		return dtoList;
	}

	// ---------------- UPDATE STUDENT ----------------
	@Override
	public SalesCourseManagementResponseDto updateStudentDetails(Long id, SalesCourseManagementRequestDto dto) {

	    SalesCourseManagement student = salesCourseManagementRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

	    String email = dto.getEmail() != null ? dto.getEmail().trim() : null;
	    String phone = dto.getPhone() != null ? dto.getPhone().trim() : null;

	    // ---------------- DUPLICATE CHECKS ----------------
	    if (phone != null && !phone.isEmpty()) {
	        SalesCourseManagement phoneCheck = salesCourseManagementRepository.findByPhone(phone);
	        if (phoneCheck != null && !phoneCheck.getStudentId().equals(id)) {
	            throw new DuplicateFieldException("Phone already exists!");
	        }
	        if (userRepository.findByPhone(phone) != null
	                || studentPersonalInfoRepository.findByParentMobileNumber(phone) != null) {
	            throw new DuplicateFieldException("Phone exists in User/Parent!");
	        }
	    }

	    if (email != null && !email.isEmpty()) {
	        SalesCourseManagement emailCheck = salesCourseManagementRepository.findByEmail(email);
	        if (emailCheck != null && !emailCheck.getStudentId().equals(id)) {
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
	        student.setCourseManagement(course);
	    }

	    // ---------------- MAIN FIELDS ----------------
	    if (dto.getStudentName() != null) student.setStudentName(dto.getStudentName());
	    if (phone != null && !phone.isEmpty()) student.setPhone(phone);
	    if (email != null && !email.isEmpty()) student.setEmail(email);
	    if (dto.getGender() != null) student.setGender(dto.getGender());
	    if (dto.getPassedOutYear() != null) student.setPassedOutYear(dto.getPassedOutYear());
	    if (dto.getQualification() != null) student.setQualification(dto.getQualification());

	    // Capture OLD status before updating
	    String oldStatus = student.getStatus();

	    if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty())
	        student.setStatus(dto.getStatus().trim());

	    // ---------------- OPTIONAL FIELDS ----------------
	    if (dto.getCollege() != null) student.setCollege(dto.getCollege().trim());
	    if (dto.getCity() != null) student.setCity(dto.getCity().trim());
	    if (dto.getSource() != null) student.setSource(dto.getSource().trim());
	    if (dto.getCampaign() != null) student.setCampaign(dto.getCampaign().trim());

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
	                    "This user (" + assignedUser.getFirstName() + ") cannot be assigned to a student");
	        }

	        // Valid manual assignment
	        student.setAssignedTo(assignedUser);
	     // Suppose frontend sends the logged-in user's ID in DTO
	        Long loggedInUserId = dto.getLoggedInUserId();

	        User loggedInUser = userRepository.findById(loggedInUserId)
	                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	        // Assign to student
	        student.setAssignedBy(loggedInUser);  // ✅ stores the User entity
	        student.setAssignedAt(LocalDateTime.now());

	        

	    } else {
	        student.setAssignedTo(null);
	        student.setAssignedBy(null);
	        student.setAssignedAt(null);
	    }

	    // Save update
	    SalesCourseManagement updated = salesCourseManagementRepository.save(student);

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
	public String bulkUpdateStatus(List<Long> studentIds, String status, Long loggedInUserId) {

	    if (studentIds == null || studentIds.isEmpty()) {
	        throw new IllegalArgumentException("Student IDs cannot be empty");
	    }

	    if (status == null || status.trim().isEmpty()) {
	        throw new IllegalArgumentException("Status cannot be empty");
	    }

	    if (loggedInUserId == null) {
	        throw new IllegalArgumentException("Logged-in user ID is required for assignment");
	    }

	    List<SalesCourseManagement> students = salesCourseManagementRepository.findAllById(studentIds);

	    if (students.isEmpty()) {
	        throw new ResourceNotFoundException("No students found for the given IDs");
	    }

	    List<SalesCourseManagement> studentsToSave = new ArrayList<>();

	    for (SalesCourseManagement student : students) {
	        String oldStatus = student.getStatus();

	        // Update only status
	        student.setStatus(status.trim());
	        studentsToSave.add(student);

	        // Auto-assign if status changed to NEW
	        if (!status.equalsIgnoreCase(oldStatus) && "NEW".equalsIgnoreCase(status)) {
	            autoAssignOnStatusChange(student, loggedInUserId); // ✅ saves internally
	        }
	    }

	    // Batch save remaining students (excluding auto-assigned ones if already saved)
	    salesCourseManagementRepository.saveAll(studentsToSave);

	    return studentsToSave.size() + " students updated successfully with status: " + status;
	}


	
	
	@Override
	@Transactional
	public String bulkAssignStudentsToUser(List<Long> studentIds, Long assignedUserId, Long loggedInUserId) {

	    if (assignedUserId == null || studentIds == null || studentIds.isEmpty()) {
	        throw new IllegalArgumentException("Student IDs and Assigned User ID cannot be empty");
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
	                "This user (" + assignedUser.getFirstName() + ") cannot be assigned to students"
	        );
	    }

	    // FETCH STUDENTS
	    List<SalesCourseManagement> students = salesCourseManagementRepository.findAllById(studentIds);

	    if (students.isEmpty()) {
	        throw new ResourceNotFoundException("No valid student IDs provided");
	    }

	    // FETCH LOGGED-IN USER
	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    // BULK ASSIGN
	    for (SalesCourseManagement student : students) {
	        student.setAssignedTo(assignedUser);
	        student.setAssignedBy(loggedInUser);  // ✅ store who performed assignment
	        student.setAssignedAt(LocalDateTime.now());
	    }

	    salesCourseManagementRepository.saveAll(students);

	    return "Successfully assigned " + students.size() + " students to " + assignedUser.getFirstName();
	}



	// ---------------- DELETE STUDENT ----------------
	@Override
	public void deleteStudent(Long id) {
		SalesCourseManagement student = salesCourseManagementRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
		salesCourseManagementRepository.delete(student);
	}

	// ---------------- GET STUDENTS BY STATUS ----------------
	@Override
	public List<SalesCourseManagementResponseDto> getStudentsByStatus(String status) {

		if (status == null || status.trim().isEmpty()) {
			throw new IllegalArgumentException("Status cannot be empty!");
		}

		List<SalesCourseManagement> students = salesCourseManagementRepository.findByStatus(status.trim());
		if (students.isEmpty()) {
			throw new ResourceNotFoundException("No students found with status: " + status);
		}

		List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
		for (SalesCourseManagement sc : students) {
			dtoList.add(SalesCourseManagementMapper.toResponseDto(sc));
		}
		return dtoList;
	}

	@Override
	 @Transactional
	public Map<String, Object> getStudentsWithPagination(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);

		Page<SalesCourseManagement> pagedResult = salesCourseManagementRepository.findAll(pageable);

		List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
		for (SalesCourseManagement student : pagedResult.getContent()) {
			dtoList.add(SalesCourseManagementMapper.toResponseDto(student));
		}

		Map<String, Object> response = new HashMap<>();
		response.put("students", dtoList);
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

	    // 2️⃣ Fetch load counts (only NEW students)
	    List<Object[]> counts = salesCourseManagementRepository.getNewStudentCounts();

	    Map<Long, Long> loadMap = new HashMap<>();

	    for (Object[] row : counts) {
	        Long userId = (Long) row[0];
	        Long cnt = (Long) row[1];
	        loadMap.put(userId, cnt);
	    }

	    // 3️⃣ Pick counsellor with lowest NEW student count
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


	
	private void autoAssignOnStatusChange(SalesCourseManagement student, Long loggedInUserId) {

	    if (!"NEW".equalsIgnoreCase(student.getStatus())) {
	        return;
	    }

	    User bestUser = findBestCounsellorForAutoAssign();
	    if (bestUser == null) return;

	    student.setAssignedTo(bestUser);

	    if (loggedInUserId != null) {
	        User loggedInUser = userRepository.findById(loggedInUserId)
	                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
	        student.setAssignedBy(loggedInUser); // ✅ store User entity
	    }

	    student.setAssignedAt(LocalDateTime.now());
	    salesCourseManagementRepository.save(student);
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

	    // 2️⃣ Fetch NEW students only
	    List<SalesCourseManagement> newStudents =
	            salesCourseManagementRepository.findByStatus("NEW");

	    if (newStudents.isEmpty()) {
	        return "No NEW students available.";
	    }

	    // 3️⃣ Sort counsellors by ID for stable distribution
	    counsellors.sort((a, b) -> Long.compare(a.getUserId(), b.getUserId()));

	    int cCount = counsellors.size();
	    int index = 0;

	    // 4️⃣ Fetch logged-in user entity
	    User loggedInUser = userRepository.findById(loggedInUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

	    // 5️⃣ Clear all NEW student assignments before reassigning
	    for (SalesCourseManagement s : newStudents) {
	        s.setAssignedTo(null);
	    }

	    // 6️⃣ Apply Round Robin (Equal Distribution)
	    for (SalesCourseManagement s : newStudents) {
	        User assignTo = counsellors.get(index);

	        s.setAssignedTo(assignTo);
	        s.setAssignedBy(loggedInUser); // ✅ stores the logged-in user entity
	        s.setAssignedAt(LocalDateTime.now());

	        index = (index + 1) % cCount;
	    }

	    salesCourseManagementRepository.saveAll(newStudents);

	    return "Rebalance completed successfully. "
	            + newStudents.size() + " students distributed equally among "
	            + cCount + " counsellors.";
	}

	@Override
	 @Transactional
	public List<AssignedCountResponseDto> getAssignedCountsForCounsellors() {

	    // Fetch counts only for NEW status students
	    List<Object[]> results = salesCourseManagementRepository.getNewStudentCounts();

	    List<AssignedCountResponseDto> response = new ArrayList<>();

	    for (Object[] row : results) {
	        Long counsellorId = (Long) row[0];
	        Long assignedCount = (Long) row[1];

	        response.add(new AssignedCountResponseDto(counsellorId, assignedCount));
	    }

	    return response;
	}



}