package com.mockInterview.requestDtos;



import java.util.List;

import lombok.Data;
@Data
public class BulkAssignRequest {

    private List<Long> studentIds;  // IDs of students to assign
    private Long assignedUserId;    // User ID (counsellor / SA_ / MASTER_ADMIN)

    
}

