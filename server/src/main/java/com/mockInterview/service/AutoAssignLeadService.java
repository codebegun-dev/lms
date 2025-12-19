package com.mockInterview.service;


import java.util.List;


import com.mockInterview.requestDtos.BulkLeadAssignRequestDto;
import com.mockInterview.requestDtos.BulkReassignLeadsRequestDto;
import com.mockInterview.responseDtos.AssignableUserDto;
import com.mockInterview.responseDtos.AssignedLeadsUserDashboardResponseDto;

public interface AutoAssignLeadService {
    void autoAssignLeads();
    
    public void bulkReassignLeads(BulkReassignLeadsRequestDto dto);
    public void assignLeadsToUser(BulkLeadAssignRequestDto dto);
    public List<AssignableUserDto> getAllAutoAssignUsers();
    
    public AssignedLeadsUserDashboardResponseDto getAllLeadsWithAssignedUsers(int page, int pageSize);
}
