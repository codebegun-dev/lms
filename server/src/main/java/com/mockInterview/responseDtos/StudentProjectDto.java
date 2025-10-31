package com.mockInterview.responseDtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentProjectDto {

    private Long id;
    private Long userId;
    private String projectTitle;
    private String usedTechnologies;
    private String role;
    private String description;
}
