package com.mockInterview.serviceImpl;

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
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;
import com.mockInterview.service.SalesCourseService;

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

		// Ensure cleaned values
		entity.setPhone(phone);
		if (email != null && !email.isEmpty()) {
			entity.setEmail(email);
		}

		// --------------------- FORCE DEFAULT ASSIGNMENT ---------------------
		// Even if client sends assignedUserId → IGNORE
		entity.setAssignedTo(null); // null = Unassigned

		// --------------------- SAVE ---------------------
		SalesCourseManagement saved = salesCourseManagementRepository.save(entity);

		// --------------------- RESPONSE DTO ---------------------
		return SalesCourseManagementMapper.toResponseDto(saved);
	}

	@Override
	public Map<String, Object> uploadStudentsFromExcel(MultipartFile file) {

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
			dto.setAssignedUserId(null);

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
		if (dto.getStudentName() != null)
			student.setStudentName(dto.getStudentName());
		if (phone != null && !phone.isEmpty())
			student.setPhone(phone);
		if (email != null && !email.isEmpty())
			student.setEmail(email);
		if (dto.getGender() != null)
			student.setGender(dto.getGender());
		if (dto.getPassedOutYear() != null)
			student.setPassedOutYear(dto.getPassedOutYear());
		if (dto.getQualification() != null)
			student.setQualification(dto.getQualification());
		if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty())
			student.setStatus(dto.getStatus().trim());

		// ---------------- OPTIONAL FIELDS ----------------
		if (dto.getCollege() != null)
			student.setCollege(dto.getCollege().trim());
		if (dto.getCity() != null)
			student.setCity(dto.getCity().trim());
		if (dto.getSource() != null)
			student.setSource(dto.getSource().trim());
		if (dto.getCampaign() != null)
			student.setCampaign(dto.getCampaign().trim());

		// ===========================================================
//      🔥 USER ASSIGNMENT RESTRICTION LOGIC
//===========================================================
		if (dto.getAssignedUserId() != null) {

			User assignedUser = userRepository.findById(dto.getAssignedUserId())
					.orElseThrow(() -> new ResourceNotFoundException("Assigned User not found"));

			String roleName = assignedUser.getRole() != null ? assignedUser.getRole().getName() : null;

// Allowed conditions:
// 1️⃣ Role starts with "SA_"  (Example: SA_EXECUTIVE, SA_TEAM_LEAD)
// 2️⃣ Role is MASTER_ADMIN
			boolean isSalesRole = roleName != null && roleName.startsWith("SA_");
			boolean isMasterAdmin = "MASTER_ADMIN".equals(roleName);

			if (!isSalesRole && !isMasterAdmin) {
				throw new UnauthorizedActionException(
						"This user (" + assignedUser.getFirstName() + ") cannot be assigned to a student");
			}

// Valid assignment
			student.setAssignedTo(assignedUser);

		} else {
// incoming null → UNASSIGNED
			student.setAssignedTo(null);
		}

		// Save data
		SalesCourseManagement updated = salesCourseManagementRepository.save(student);

		return SalesCourseManagementMapper.toResponseDto(updated);
	}
	
	
	@Override
	public String bulkAssignStudentsToUser(List<Long> studentIds, Long assignedUserId) {

	    if (assignedUserId == null || studentIds == null || studentIds.isEmpty()) {
	        throw new IllegalArgumentException("Student IDs and Assigned User ID cannot be empty");
	    }

	    User assignedUser = userRepository.findById(assignedUserId)
	            .orElseThrow(() -> new ResourceNotFoundException("Assigned User not found"));

	    // ------------ ROLE VALIDATION (REUSED FROM UPDATE LOGIC) ------------
	    String roleName = assignedUser.getRole() != null ? assignedUser.getRole().getName() : null;

	    boolean isSalesRole = roleName != null && roleName.startsWith("SA_");
	    boolean isMasterAdmin = "MASTER_ADMIN".equals(roleName);

	    if (!isSalesRole && !isMasterAdmin) {
	        throw new UnauthorizedActionException(
	                "This user (" + assignedUser.getFirstName() + ") cannot be assigned to students"
	        );
	    }

	    // ------------ FETCH STUDENTS ------------
	    List<SalesCourseManagement> students = salesCourseManagementRepository.findAllById(studentIds);

	    if (students.isEmpty()) {
	        throw new ResourceNotFoundException("No valid student IDs provided");
	    }

	    // ------------ BULK ASSIGN ------------
	    for (SalesCourseManagement student : students) {
	        student.setAssignedTo(assignedUser);
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

}