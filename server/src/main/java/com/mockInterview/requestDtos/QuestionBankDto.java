package com.mockInterview.requestDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionBankDto {

   

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title can be max 500 characters")
    private String title;

    @NotBlank(message = "Topic is required")
    private String topic;
   
    @NotNull(message = "AdminId is required")
    private Long adminId; 
}
