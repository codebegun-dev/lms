package com.mockInterview.responseDtos;

import lombok.Data;
import java.time.LocalDate;



@Data
public class QuestionBankResponseDto {
    private Long id;
    private String title;
    private String difficulty;
    private String categoryName;
    private String topicName;
    private String subTopicName;
    private String createdBy;  // ✅ only user name, not user object
    private LocalDate createdDate;
}
