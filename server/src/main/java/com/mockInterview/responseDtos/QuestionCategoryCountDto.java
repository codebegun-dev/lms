package com.mockInterview.responseDtos;



import lombok.Data;
import java.util.Map;

@Data
public class QuestionCategoryCountDto {
    private long totalQuestions;
    private Map<String, Long> categoryWiseCount;
}
