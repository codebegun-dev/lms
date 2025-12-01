package com.mockInterview.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.AssignedCountResponseDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;

public interface SalesCourseService {

    // ---------------- CREATE LEAD ----------------
    SalesCourseManagementResponseDto createLead(SalesCourseManagementRequestDto dto);

    // ---------------- UPLOAD LEADS FROM EXCEL ----------------
    Map<String, Object> uploadLeadsFromExcel(MultipartFile file, Long loggedInUserId);

    // ---------------- GET LEAD BY ID ----------------
    SalesCourseManagementResponseDto getLeadsById(Long id);

    // ---------------- UPDATE LEAD ----------------
    SalesCourseManagementResponseDto updateLeadDetails(Long id, SalesCourseManagementRequestDto dto);

    // ---------------- DELETE LEAD ----------------
    void deleteLead(Long id);

    // ---------------- GET LEADS BY ROLE WITH PAGINATION ----------------
    Map<String, Object> getLeadsByRoleWithPagination(Long loggedInUserId, Integer page, Integer size);

    // ---------------- GET LEADS BY STATUS ----------------
    List<SalesCourseManagementResponseDto> getLeadsByStatus(String status);

    // ---------------- BULK STATUS UPDATE ----------------
    String bulkUpdateStatus(List<Long> leadIds, String status, Long loggedInUserId);

    // ---------------- BULK ASSIGN ----------------
    String bulkAssignLeadsToUser(List<Long> leadIds, Long assignedUserId, Long loggedInUserId);

    // ---------------- REBALANCE LEADS ----------------
    String rebalanceAssignments(Long loggedInUserId);

    // ---------------- GET ASSIGNED COUNTS ----------------
    List<AssignedCountResponseDto> getAssignedCountsForCounsellors();
}
