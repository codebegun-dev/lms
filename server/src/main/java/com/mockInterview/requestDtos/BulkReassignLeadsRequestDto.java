package com.mockInterview.requestDtos;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BulkReassignLeadsRequestDto {

    @NotNull(message = "From User ID is required")
    private Long fromUserId;

    @NotNull(message = "To User ID is required")
    private Long toUserId;
}
