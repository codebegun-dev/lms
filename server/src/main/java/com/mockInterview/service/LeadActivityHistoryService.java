package com.mockInterview.service;

import java.time.LocalDateTime;
import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.entity.User;

public interface LeadActivityHistoryService {

	
	public void saveHistory(
            SalesCourseManagement lead,
            String oldStatus,
            String newStatus,
            User oldAssignedTo,
            User newAssignedTo,
            String notes,
            LocalDateTime reminderTime,
            Long updatedBy
    );
    
	
}
