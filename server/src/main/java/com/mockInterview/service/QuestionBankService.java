package com.mockInterview.service;

import java.util.List;
import com.mockInterview.requestDtos.QuestionBankDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.responseDtos.QuestionCategoryCountDto;

public interface QuestionBankService {

    // ✅ Create a new question
    QuestionBankResponseDto addQuestion(QuestionBankDto dto);

    // ✅ Update an existing question
    QuestionBankResponseDto updateQuestion(Long id, QuestionBankDto dto);

    // ✅ Get question by ID
    QuestionBankResponseDto getQuestionById(Long id);

    // ✅ Get all questions
    List<QuestionBankResponseDto> getAllQuestions();

    // ✅ Get questions by SubTopic ID
    List<QuestionBankResponseDto> getQuestionsBySubTopicId(Long subTopicId);

    // ✅ Delete question by ID
    void deleteQuestion(Long id);

    // ✅ Combined filter using IDs (Category, Topic, SubTopic, Difficulty, Title)
    List<QuestionBankResponseDto> searchQuestions(
            Long categoryId,
            Long topicId,
            Long subTopicId,
            String difficulty,
            String title
    );

    // ✅ Combined filter using names (Category, Topic, SubTopic, Difficulty, Title)
    List<QuestionBankResponseDto> getQuestionsByFilters(
            String categoryName,
            String topicName,
            String subTopicName,
            String difficulty,
            String title
    );
    
    QuestionCategoryCountDto getQuestionCountsByCategory();
    
    public List<QuestionBankResponseDto> getRandomQuestionsByCategory(Long categoryId);
    

}
