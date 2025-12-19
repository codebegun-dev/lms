package com.mockInterview.requestDtos;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BulkLeadAssignRequestDto {

    @NotEmpty(message = "Lead IDs cannot be empty")
    private List<Long> leadIds;

    @NotNull(message = "Assigned user ID is required")
    private Long assignedUserId;
}
