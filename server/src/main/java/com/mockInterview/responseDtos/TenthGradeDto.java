package com.mockInterview.responseDtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenthGradeDto {

    private Long id;
    private Long userId;
    private String board;
    private String schoolName;
    private String yearOfPassout;
    private String marksPercentage;
}
