//package com.mockInterview.controller;
//
//import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
//import com.mockInterview.responseDtos.StudentPersonalInfoResponseDto;
//
//import com.mockInterview.security.annotations.ModulePermission;
//import com.mockInterview.service.StudentPersonalInfoService;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import java.io.IOException;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//@ModulePermission("STUDENT_MANAGEMENT")
//@RestController
//@RequestMapping("/api/students")
//public class StudentPersonalInfoController {
//
//    @Autowired
//    private StudentPersonalInfoService studentPersonalInfoService;
//
//    @PutMapping("/{userId}/personal-info")
//   
//    public StudentPersonalInfoResponseDto updateStudentPersonalInfo(
//            @PathVariable Long userId,
//            @RequestPart("data") String data,
//            @RequestPart(value = "file", required = false) MultipartFile file
//    ) throws IOException {
//
//        ObjectMapper mapper = new ObjectMapper();
//        mapper.registerModule(new JavaTimeModule());
//
//        StudentPersonalInfoUpdateRequest request =
//                mapper.readValue(data, StudentPersonalInfoUpdateRequest.class);
//
//        return studentPersonalInfoService.updateStudentPersonalInfo(
//                userId, request, file
//        );
//    }
//
//    // ==================== READ STUDENT PERSONAL INFO ====================
//    @GetMapping("/{userId}/personal-info")
//    public StudentPersonalInfoResponseDto getStudentPersonalInfo(
//            @PathVariable Long userId) {
//
//        return studentPersonalInfoService.getByUserId(userId);
//    }
//}

package com.mockInterview.controller;
import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoResponseDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.StudentPersonalInfoService;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
@ModulePermission("STUDENT_MANAGEMENT")
@RestController
@RequestMapping("/api/students")
public class StudentPersonalInfoController {
	
	@Autowired
 private StudentPersonalInfoService studentPersonalInfoService;

	
	@PutMapping("/{userId}/personal-info")
	@PreAuthorize("hasAuthority('UPDATE_STUDENT')")
	public StudentPersonalInfoResponseDto updateStudentPersonalInfo(
	        @PathVariable Long userId,
	        @RequestPart("data") String data,
	        @RequestPart(value = "file", required = false) MultipartFile file
	) throws IOException {

	    ObjectMapper mapper = new ObjectMapper();
	    mapper.registerModule(new JavaTimeModule());

	    StudentPersonalInfoUpdateRequest request =
	            mapper.readValue(data, StudentPersonalInfoUpdateRequest.class);

	    return studentPersonalInfoService.updateStudentPersonalInfo(
	            userId, request, file
	    );
	}
	
	@GetMapping("/{userId}/personal-info")
	
	public StudentPersonalInfoResponseDto getStudentPersonalInfo(
	        @PathVariable Long userId) {

	    return studentPersonalInfoService.getStudentPersonalInfoByUserId(userId);
	}


}

