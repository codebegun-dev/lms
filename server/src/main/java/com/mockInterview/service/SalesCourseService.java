package com.mockInterview.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;


import com.mockInterview.requestDtos.SalesCourseManagementRequestDto;
import com.mockInterview.responseDtos.AssignedCountResponseDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;

public interface SalesCourseService {

    
    SalesCourseManagementResponseDto createLead(SalesCourseManagementRequestDto dto);
    public Map<String, Object> uploadLeadsFromExcel(MultipartFile file, Long loggedInUserId);

    
    SalesCourseManagementResponseDto getLeadsById(Long id);

    
   

    
    SalesCourseManagementResponseDto updateLeadDetails(Long id, SalesCourseManagementRequestDto dto);

   
    void deleteLead(Long id);
    
    
    
    public Map<String, Object> getLeadsByRoleWithPagination(Long loggedInUserId, Integer page, Integer size);
    	

    
    List<SalesCourseManagementResponseDto> getLeadsByStatus(String status);
    
    public String bulkUpdateStatus(List<Long> leadIds, String status, Long loggedInUserId);

   public String bulkAssignLeadsToUser(List<Long> leadIds, Long assignedUserId, Long loggedInUserId);
    public String rebalanceAssignments(Long loggedInUserId);
    
    public List<AssignedCountResponseDto> getAssignedCountsForCounsellors();
    
   
    	
    
    

}
