package com.mockInterview.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.mockInterview.requestDtos.BulkAssignRequest;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;
import com.mockInterview.service.SalesCourseService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saleCourse/student")
@CrossOrigin(origins = "*")
public class SalesCourseController { 
    
    @Autowired
    private SalesCourseService salesCourseService;

    // CREATE
    @PostMapping
    public SalesCourseManagementResponseDto createStudent(
            @Valid @RequestBody SalesCourseManagementRequestDto dto) {
        return salesCourseService.createStudent(dto);
    } 
    
    @PostMapping("/bulk-upload")
    public Map<String, Object> uploadStudents(@RequestParam("file") MultipartFile file) {
        return salesCourseService.uploadStudentsFromExcel(file);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public SalesCourseManagementResponseDto getStudentById(@PathVariable Long id) {
        return salesCourseService.getStudentsById(id);
    }

    // GET ALL
    @GetMapping
    public List<SalesCourseManagementResponseDto> getAllStudents() {
        return salesCourseService.getAllStudents();
    }

    // UPDATE
    @PutMapping("/{id}")
    public SalesCourseManagementResponseDto updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody SalesCourseManagementRequestDto dto) {
        return salesCourseService.updateStudentDetails(id, dto);
    }
    
    @PostMapping("/assign/bulk")
    public String bulkAssign(@RequestBody BulkAssignRequest request) {
        return salesCourseService.bulkAssignStudentsToUser(
                request.getStudentIds(),
                request.getAssignedUserId()
        );
    }


    // DELETE
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        salesCourseService.deleteStudent(id);
        return "Student deleted successfully with ID: " + id;
    }
    
    @GetMapping("/status/{status}")
    public List<SalesCourseManagementResponseDto> getStudentsByStatus(@PathVariable String status) {
        return salesCourseService.getStudentsByStatus(status);
    }
    
    
    @GetMapping("/students")
    public Map<String, Object> getPaginatedStudents(
            @RequestParam(defaultValue = "0") int page
    ) {
        return salesCourseService.getStudentsWithPagination(page, 30);
    }



}
