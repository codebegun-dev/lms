package com.mockInterview.service;

import java.util.List;


import com.mockInterview.requestDtos.BulkLeadStatusUpdateRequestDto;
import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;

import com.mockInterview.responseDtos.BulkUploadResponseDto;
import com.mockInterview.responseDtos.LeadsDashboardResponseDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;

public interface SalesCourseManagementService {

   
    SalesCourseManagementResponseDto createLead(SalesCourseManagementRequestDto dto);
    
    public BulkUploadResponseDto createLeadsBulk(List<SalesCourseManagementRequestDto> dtos);
    
    public LeadsDashboardResponseDto getAllLeadsDashboard(int page, int pageSize);
    
    SalesCourseManagementResponseDto updateLead(Long leadId, SalesCourseManagementRequestDto dto);
    
    void bulkUpdateLeadStatus(BulkLeadStatusUpdateRequestDto dto);

    

    
    
    }
