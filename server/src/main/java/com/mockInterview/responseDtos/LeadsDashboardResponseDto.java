package com.mockInterview.responseDtos;

import lombok.Data;
import java.util.List;
import java.util.Map;
@Data
public class LeadsDashboardResponseDto {

    private Long totalLeads;

    
    private Long assignedUsersCount;

    private Map<String, Long> statusCounts;

    private List<SalesCourseManagementResponseDto> leadsList;

    
    private int currentPage;
    private int pageSize;
    private int totalPages;
    
}
