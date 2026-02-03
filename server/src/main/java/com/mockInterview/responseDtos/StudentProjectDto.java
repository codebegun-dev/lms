package com.mockInterview.responseDtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentProjectDto {

    private Long id;

    // ================= USER =================
    private Long userId;

    // ================= PROJECT DETAILS =================
    private String projectTitle;
    private String usedTechnologies;
    private String role;
    private String description;

    // ================= AUDIT FIELDS =================
    private LocalDateTime updatedAt;
    private String updatedBy;
}
