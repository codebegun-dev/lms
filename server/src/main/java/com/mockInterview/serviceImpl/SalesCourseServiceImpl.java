package com.mockInterview.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.CourseManagement;
import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.SalesCourseManagementMapper;
import com.mockInterview.repository.CourseManagementRepository;
import com.mockInterview.repository.SalesCourseManagementRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;
import com.mockInterview.service.SalesCourseService;
@Service
public class SalesCourseServiceImpl implements SalesCourseService {
	@Autowired
	private UserRepository userRepository;
     @Autowired
	private StudentPersonalInfoRepository studentPersonalInfoRepository;
     
     @Autowired
     private SalesCourseManagementRepository  salesCourseManagementRepository;
     
     @Autowired
     private CourseManagementRepository  courseManagementRepository;

     @Override
     public SalesCourseManagementResponseDto createStudent(SalesCourseManagementRequestDto dto) {

         // --------------------- VALIDATION CHECKS ---------------------

         if (dto.getEmail() != null &&
             userRepository.findByEmail(dto.getEmail()) != null) {
             throw new DuplicateFieldException("Email already exists!");
         }

         if (dto.getPhone() != null &&
             (userRepository.findByPhone(dto.getPhone()) != null ||
              studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null)) {
             throw new DuplicateFieldException("Phone already exists!");
         }

         // Sales table duplicate checks
         if (dto.getEmail() != null) {
             SalesCourseManagement emailCheck = salesCourseManagementRepository.findByEmail(dto.getEmail());
             if (emailCheck != null) {
                 throw new DuplicateFieldException("Email already exists in Sales table!");
             }
         }

         SalesCourseManagement phoneCheck = salesCourseManagementRepository.findByPhone(dto.getPhone());
         if (phoneCheck != null) {
             throw new DuplicateFieldException("Phone already exists!");
         }

         // --------------------- CREATE ENTITY ---------------------

         SalesCourseManagement entity = new SalesCourseManagement();
         entity.setStudentName(dto.getStudentName());   // mandatory
         entity.setPhone(dto.getPhone());               // mandatory

         // Optional fields: set only if provided
         if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
         if (dto.getGender() != null) entity.setGender(dto.getGender());
         if (dto.getPassedOutYear() != null) entity.setPassedOutYear(dto.getPassedOutYear());
         if (dto.getQualification() != null) entity.setQualification(dto.getQualification());

         // Optional: courseId
         if (dto.getCourseId() > 0) {
             CourseManagement course = courseManagementRepository.findById(dto.getCourseId())
                     .orElseThrow(() -> new ResourceNotFoundException("Course not found!"));
             entity.setCourseManagement(course);
         }

         // Optional status
         if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
             entity.setStatus(dto.getStatus().trim());
         }

         // --------------------- SAVE ---------------------
         SalesCourseManagement saved = salesCourseManagementRepository.save(entity);

         return SalesCourseManagementMapper.toResponseDto(saved);
     }


     @Override
     public SalesCourseManagementResponseDto getStudentsById(Long id) {

         SalesCourseManagement student = salesCourseManagementRepository.findById(id)
                 .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

         return SalesCourseManagementMapper.toResponseDto(student);
     }


     @Override
     public List<SalesCourseManagementResponseDto> getAllStudents() {

         List<SalesCourseManagement> students = salesCourseManagementRepository.findAll();
         List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();

         for (SalesCourseManagement student : students) {
             SalesCourseManagementResponseDto dto = SalesCourseManagementMapper.toResponseDto(student);
             dtoList.add(dto);
         }

         return dtoList;
     }


     @Override
     public SalesCourseManagementResponseDto updateStudentDetails(Long id, SalesCourseManagementRequestDto dto) {

         SalesCourseManagement student = salesCourseManagementRepository.findById(id)
                 .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

         // -------------------- DUPLICATE CHECKS --------------------

         // Email duplicate check in Sales table
         if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
             SalesCourseManagement emailCheck = salesCourseManagementRepository.findByEmail(dto.getEmail());
             if (emailCheck != null && emailCheck.getStudentId() != id) {
                 throw new DuplicateFieldException("Email already exists!");
             }

             if (userRepository.findByEmail(dto.getEmail()) != null) {
                 throw new DuplicateFieldException("Email already exists in User table!");
             }
         }

         // Phone duplicate checks
         if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {

             SalesCourseManagement phoneCheck = salesCourseManagementRepository.findByPhone(dto.getPhone());
             if (phoneCheck != null && phoneCheck.getStudentId() != id) {
                 throw new DuplicateFieldException("Phone number already exists!");
             }

             if (userRepository.findByPhone(dto.getPhone()) != null ||
                 studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null) {

                 throw new DuplicateFieldException("Phone already exists in User/Parent table!");
             }
         }

         // -------------------- OPTIONAL COURSE UPDATE --------------------
         if (dto.getCourseId() > 0) {
             CourseManagement course = courseManagementRepository.findById(dto.getCourseId())
                     .orElseThrow(() -> new ResourceNotFoundException("Course not found!"));
             student.setCourseManagement(course);
         }

         // -------------------- UPDATE FIELDS IF PROVIDED --------------------

         if (dto.getStudentName() != null) student.setStudentName(dto.getStudentName());
         if (dto.getPhone() != null) student.setPhone(dto.getPhone());
         if (dto.getEmail() != null) student.setEmail(dto.getEmail());
         if (dto.getGender() != null) student.setGender(dto.getGender());
         if (dto.getPassedOutYear() != null) student.setPassedOutYear(dto.getPassedOutYear());
         if (dto.getQualification() != null) student.setQualification(dto.getQualification());

         
         if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
             student.setStatus(dto.getStatus().trim());
         }

         // -------------------- SAVE --------------------
         SalesCourseManagement updated = salesCourseManagementRepository.save(student);

         return SalesCourseManagementMapper.toResponseDto(updated);
     }


     @Override
     public void deleteStudent(Long id) {

        
         SalesCourseManagement student = salesCourseManagementRepository.findById(id)
                 .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

         
         salesCourseManagementRepository.delete(student);
     }

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

	
	

}
