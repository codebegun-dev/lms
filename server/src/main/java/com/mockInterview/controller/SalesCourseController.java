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
@RequestMapping("/api/saleCourse/leads")
@CrossOrigin(origins = "*")
public class SalesCourseController {

    @Autowired
    private SalesCourseService salesCourseService; 

    // ---------------- CREATE LEAD ----------------
    @PostMapping
    public SalesCourseManagementResponseDto createLead(
            @Valid @RequestBody SalesCourseManagementRequestDto dto) {
        return salesCourseService.createLead(dto);
    }

    // ---------------- BULK UPLOAD ----------------
    @PostMapping("/bulk-upload")
    public Map<String, Object> uploadLeads(
            @RequestParam("file") MultipartFile file,
            @RequestParam("loggedInUserId") Long loggedInUserId) {
        return salesCourseService.uploadLeadsFromExcel(file, loggedInUserId);
    }

    // ---------------- GET SINGLE LEAD ----------------
    @GetMapping("/{id}")
    public SalesCourseManagementResponseDto getLeadById(@PathVariable Long id) {
        return salesCourseService.getLeadsById(id);
    }

    // ---------------- UPDATE LEAD ----------------
    @PutMapping("/{id}")
    public SalesCourseManagementResponseDto updateLead(
            @PathVariable Long id,
            @Valid @RequestBody SalesCourseManagementRequestDto dto) {
        return salesCourseService.updateLeadDetails(id, dto);
    }

    // ---------------- DELETE LEAD ----------------
    @DeleteMapping("/{id}")
    public String deleteLead(@PathVariable Long id) {
        salesCourseService.deleteLead(id);
        return "Student deleted successfully with ID: " + id;
    }

    // ---------------- GET ALL OR ASSIGNED STUDENTS ----------------
    @GetMapping
    public List<SalesCourseManagementResponseDto> getLeads(
            @RequestParam(required = false) Long userId) {

        if (userId != null) {
            return salesCourseService.getLeadsAssignedToUser(userId);
        }
        return salesCourseService.getAllLeads();
    }

    // ---------------- GET BY STATUS ----------------
    @GetMapping("/status/{status}")
    public List<SalesCourseManagementResponseDto> getLeadsByStatus(@PathVariable String status) {
        return salesCourseService.getLeadsByStatus(status);
    }

    // ---------------- PAGINATED LEADS ----------------
    @GetMapping("/paginated")
    public Map<String, Object> getPaginatedLeads(
            @RequestParam(defaultValue = "0") int page) {
        return salesCourseService.getLeadsWithPagination(page, 14);
    }

    // ---------------- BULK UPDATE STATUS ----------------
    @PostMapping("/bulk-update-status")
    public String bulkUpdateStatus(
            @Valid @RequestBody BulkUpdateRequestDto request) {

        return salesCourseService.bulkUpdateStatus(
                request.getLeadIds(),
                request.getStatus(),
                request.getLoggedInUserId());
    }

    // ---------------- BULK ASSIGN ----------------
    @PostMapping("/assign/bulk")
    public String bulkAssign(
            @RequestBody BulkAssignRequest request,
            @RequestParam("loggedInUserId") Long loggedInUserId) {

        return salesCourseService.bulkAssignLeadsToUser(
                request.getLeadIds(),
                request.getAssignedUserId(),
                loggedInUserId);
    }

    // ---------------- GET ASSIGNED COUNTS ----------------
    @GetMapping("/assigned-counts")
    public List<AssignedCountResponseDto> getAssignedCounts() {
        return salesCourseService.getAssignedCountsForCounsellors();
    }

    // ---------------- AUTO REBALANCE ----------------
    @PostMapping("/auto-rebalance")
    public String rebalance(@RequestParam("loggedInUserId") Long loggedInUserId) {
        return salesCourseService.rebalanceAssignments(loggedInUserId);
    }
}
