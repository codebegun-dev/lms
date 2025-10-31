package com.mockInterview.responseDtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTwelfthGradeDto {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Board name is required")
    private String board;

    @NotBlank(message = "Group name is required")
    private String groupName;

    @NotBlank(message = "College name is required")
    private String collegeName;

    @NotNull(message = "Year of passout is required")
    @Min(value = 1950, message = "Year of passout must be after 1950")
    private Integer yearOfPassout;

    @NotNull(message = "Marks percentage is required")
    @DecimalMin(value = "0.0", message = "Marks percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Marks percentage cannot exceed 100")
    private Double marksPercentage;
}
