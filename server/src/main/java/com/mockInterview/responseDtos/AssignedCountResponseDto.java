package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssignedCountResponseDto {

    private Long counsellorId;
    private Long assignedCount;
}
