package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTwelfthGradeDto {

    private Long userId;

    private String board;

    private String groupName;

    private String collegeName;

    private Integer yearOfPassout;

    private Double marksPercentage;

    // ================= AUDIT FIELDS =================

    private LocalDateTime updatedAt;

    private String updatedBy;
}
