package com.mockInterview.requestDtos;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class BulkUpdateRequestDto {

    @NotEmpty(message = "lead IDs cannot be empty")
    private List<Long> leadIds;

    @NotNull(message = "Status cannot be null")
    private String status;
    
   private Long LoggedInUserId;

    
}
