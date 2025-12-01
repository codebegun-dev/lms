package com.mockInterview.responseDtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LeadActivityHistoryDto {

    private Long id;

    private Long leadId;

    private String oldStatus;

    private String newStatus;

    private Long oldAssignedToId;

    private Long newAssignedToId;

    private String notes;

    private LocalDateTime reminderTime;

    private LocalDateTime createdAt;
}
