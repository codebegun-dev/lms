package com.mockInterview.responseDtos;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class AssignedLeadsUserDashboardResponseDto {

    private Long totalLeads;
    private Map<String, Long> statusCounts;
 
    private int currentPage;
    private int pageSize;
    private int totalPages;
    private List<SalesCourseManagementResponseDto> leadsList;

    
}
