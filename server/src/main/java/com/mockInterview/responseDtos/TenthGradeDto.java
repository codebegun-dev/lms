package com.mockInterview.responseDtos;

import java.time.LocalDateTime;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenthGradeDto {

   
    private Long userId;
    private String board;
    private String schoolName;
    private Integer yearOfPassout;
    private Double marksPercentage;
    

    private LocalDateTime updatedAt;

    private String updatedBy;
}
