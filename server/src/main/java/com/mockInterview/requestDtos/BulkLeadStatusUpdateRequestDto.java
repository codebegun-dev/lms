package com.mockInterview.requestDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BulkLeadStatusUpdateRequestDto {

    @NotEmpty(message = "Lead IDs cannot be empty")
    private List<Long> leadIds;

    @NotBlank(message = "Status cannot be blank")
    private String status;
}
