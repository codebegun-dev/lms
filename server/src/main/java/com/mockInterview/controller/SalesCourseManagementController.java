package com.mockInterview.controller;


import com.mockInterview.requestDtos.BulkLeadAssignRequestDto;
import com.mockInterview.requestDtos.BulkLeadStatusUpdateRequestDto;
import com.mockInterview.requestDtos.BulkReassignLeadsRequestDto;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.AssignableUserDto;
import com.mockInterview.responseDtos.BulkUploadResponseDto;
import com.mockInterview.responseDtos.LeadsDashboardResponseDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.AutoAssignLeadService;
import com.mockInterview.service.SalesCourseManagementService;

import jakarta.validation.Valid;


import com.mockInterview.excelHelper.ExcelHelper;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@ModulePermission("SALES_MANAGEMENT")
@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
public class SalesCourseManagementController {

    @Autowired
    private SalesCourseManagementService salesService;
    
    @Autowired
    private AutoAssignLeadService autoAssignLeadService;
    
    @Value("${pagination.default-page-size}")
    private int defaultPageSize;
     

    // ================= CREATE SINGLE LEAD =================
    @PreAuthorize("hasAuthority('CREATE_LEAD')")
    @PostMapping("/create")
    public SalesCourseManagementResponseDto createLead(@Valid @RequestBody SalesCourseManagementRequestDto dto) {
        return salesService.createLead(dto);
    }

    // ================= BULK UPLOAD LEADS =================
    @PreAuthorize("hasAuthority('UPLOADS_BULK_LEADS')")
    @PostMapping("/bulk-upload")
    public BulkUploadResponseDto uploadLeads(@RequestParam("file") MultipartFile file) {
        List<SalesCourseManagementRequestDto> dtos = ExcelHelper.parseExcelFile(file);
        return salesService.createLeadsBulk(dtos);
    }
    
    
    
    @PreAuthorize("hasAuthority('AUTO_ASSIGN_LEADS')")
    @PostMapping("/auto-assign")
    public String autoAssignLeads() {
        autoAssignLeadService.autoAssignLeads();
        return "Leads auto-assigned successfully";
    }
    
    @PreAuthorize("hasAuthority('VIEW_LEADS')")
    @GetMapping("/dashboard")
    public LeadsDashboardResponseDto getDashboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer pageSize) {

        int finalPageSize = (pageSize != null) ? pageSize : defaultPageSize;

        boolean isAutoAssignUser =
                SecurityUtils.hasAuthority("AUTO_ASSIGN_LEADS");

        boolean isMasterAdmin =
                SecurityUtils.hasAuthority("MASTER_ADMIN");

        // 🔐 ONLY auto-assign users (NOT admins)
        if (isAutoAssignUser && !isMasterAdmin) {
            return autoAssignLeadService.getUserDashboard(page, finalPageSize);
        }

        // 🔐 Admins & others
        return salesService.getAllLeadsDashboard(page, finalPageSize);
    }




    @PreAuthorize("hasAuthority('UPDATE_LEAD')")
    @PutMapping("/{leadId}")
    public SalesCourseManagementResponseDto updateLead(@Valid
            @PathVariable Long leadId,
            @RequestBody SalesCourseManagementRequestDto dto) {

        return salesService.updateLead(leadId, dto);
    }

    
    @PreAuthorize("hasAuthority('UPDATE_LEAD')")
    @PutMapping("/bulk/status")
    public String bulkUpdateStatus(
            @RequestBody @Valid BulkLeadStatusUpdateRequestDto dto) {

        salesService.bulkUpdateLeadStatus(dto);
        
        return "status updated successfully!";
    }
    
    @PreAuthorize("hasAuthority('BULK_REASSIGN_LEADS')")
    @PostMapping("/bulk/reassign")
    public String bulkReassignLeads(
            @RequestBody @Valid BulkReassignLeadsRequestDto dto) {

        autoAssignLeadService.bulkReassignLeads(dto);
        return "Leads reassigned successfully";
    }

    @PreAuthorize("hasAuthority('BULK_REASSIGN_LEADS')")
    @PostMapping("/assign")
    public String assignLeadsToUser(
            @Valid @RequestBody BulkLeadAssignRequestDto dto) {

        autoAssignLeadService.assignLeadsToUser(dto);
        return "Leads assigned successfully";
    }
    
    
    @PreAuthorize("hasAuthority('AUTO_ASSIGN_LEADS')")
    @GetMapping("/assignable-users")
    public List<AssignableUserDto> getAssignableUsers() {
        return autoAssignLeadService.getAllAutoAssignUsers();
    }



}
