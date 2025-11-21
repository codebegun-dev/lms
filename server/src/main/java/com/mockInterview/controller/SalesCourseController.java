package com.mockInterview.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.mockInterview.requestDtos.BulkAssignRequest;
import com.mockInterview.requestDtos.BulkUpdateRequestDto;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.AssignedCountResponseDto;
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

    // ---------------- CREATE STUDENT ----------------
    @PostMapping
    public SalesCourseManagementResponseDto createStudent(
            @Valid @RequestBody SalesCourseManagementRequestDto dto) {
        return salesCourseService.createStudent(dto);
    } 
    
    // ---------------- BULK UPLOAD ----------------
    @PostMapping("/bulk-upload")
    public Map<String, Object> uploadStudents(
            @RequestParam("file") MultipartFile file,
            @RequestParam("loggedInUserId") Long loggedInUserId
    ) {
        return salesCourseService.uploadStudentsFromExcel(file, loggedInUserId);
    }

    // ---------------- GET BY ID ----------------
    @GetMapping("/{id}")
    public SalesCourseManagementResponseDto getStudentById(@PathVariable Long id) {
        return salesCourseService.getStudentsById(id);
    }

    // ---------------- GET ALL ----------------
    @GetMapping
    public List<SalesCourseManagementResponseDto> getAllStudents() {
        return salesCourseService.getAllStudents();
    }

    // ---------------- UPDATE STUDENT ----------------
    @PutMapping("/{id}")
    public SalesCourseManagementResponseDto updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody SalesCourseManagementRequestDto dto) {
        return salesCourseService.updateStudentDetails(id, dto);
    }
    
    // ---------------- BULK UPDATE STATUS ----------------
    @PostMapping("/bulk-update-status")
    public String bulkUpdateStatus(@Valid @RequestBody BulkUpdateRequestDto request) {
        return salesCourseService.bulkUpdateStatus(
                request.getStudentIds(),
                request.getStatus(),
                request.getLoggedInUserId()
        );
    }
    
    // ---------------- BULK ASSIGN ----------------
    @PostMapping("/assign/bulk")
    public String bulkAssign(
            @RequestBody BulkAssignRequest request,
            @RequestParam("loggedInUserId") Long loggedInUserId
    ) {
        return salesCourseService.bulkAssignStudentsToUser(
                request.getStudentIds(),
                request.getAssignedUserId(),
                loggedInUserId
        );
    }

    // ---------------- DELETE STUDENT ----------------
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        salesCourseService.deleteStudent(id);
        return "Student deleted successfully with ID: " + id;
    }
    
    // ---------------- GET STUDENTS BY STATUS ----------------
    @GetMapping("/status/{status}")
    public List<SalesCourseManagementResponseDto> getStudentsByStatus(@PathVariable String status) {
        return salesCourseService.getStudentsByStatus(status);
    }
    
    // ---------------- PAGINATED STUDENTS ----------------
    @GetMapping("/students")
    public Map<String, Object> getPaginatedStudents(
            @RequestParam(defaultValue = "0") int page
    ) {
        return salesCourseService.getStudentsWithPagination(page, 30);
    }

    // ---------------- AUTO REBALANCE ----------------
    @PostMapping("/auto-rebalance")
    public String rebalance(@RequestParam("loggedInUserId") Long loggedInUserId) {
        return salesCourseService.rebalanceAssignments(loggedInUserId);
    }

    // ---------------- GET ASSIGNED COUNTS ----------------
    @GetMapping("/assigned-counts")
    public List<AssignedCountResponseDto> getAssignedCounts() {
        return salesCourseService.getAssignedCountsForCounsellors();
    }
    
    @GetMapping("/assigned-to/{userId}")
    public List<SalesCourseManagementResponseDto> getAssignedStudents(@PathVariable Long userId) {
        return salesCourseService.getStudentsAssignedToUser(userId);
    }

}
