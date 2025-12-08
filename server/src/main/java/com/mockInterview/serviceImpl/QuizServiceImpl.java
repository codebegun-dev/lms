package com.mockInterview.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mockInterview.entity.Quiz;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.QuizRepository;
import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;
import com.mockInterview.service.QuizService;

@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Helper method to convert entity to response DTO
    private QuizResponseDto mapToResponseDto(Quiz quiz) {
        QuizResponseDto dto = new QuizResponseDto();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setDifficulty(quiz.getDifficulty());
        dto.setDuration(quiz.getDuration());
        dto.setMarks(quiz.getMarks());
        dto.setNegativeMarking(quiz.getNegativeMarking());
        dto.setQuestionType(quiz.getQuestionType());

        // Convert questionsJson (string) to List<Map<String,Object>>
        try {
            List<Map<String, Object>> questions = objectMapper.readValue(
                    quiz.getQuestionsJson(),
                    new TypeReference<List<Map<String, Object>>>() {}
            );
            dto.setQuestions(questions);
        } catch (JsonProcessingException e) {
            dto.setQuestions(new ArrayList<>()); // fallback empty list
        }

        dto.setCreatedAt(quiz.getCreatedAt());
        dto.setUpdatedAt(quiz.getUpdatedAt());
        return dto;
    }

    @Override
    public QuizResponseDto createQuiz(QuizRequestDto quizRequestDto) {
        Quiz quiz = new Quiz();
        quiz.setTitle(quizRequestDto.getTitle());
        quiz.setDescription(quizRequestDto.getDescription());
        quiz.setDifficulty(quizRequestDto.getDifficulty());
        quiz.setDuration(quizRequestDto.getDuration());
        quiz.setMarks(quizRequestDto.getMarks());
        quiz.setNegativeMarking(quizRequestDto.getNegativeMarking());
        quiz.setQuestionType(quizRequestDto.getQuestionType());

        try {
            // Convert List<Map<String,Object>> or List<Object> to JSON string
            String questionsJson = objectMapper.writeValueAsString(quizRequestDto.getQuestions());
            quiz.setQuestionsJson(questionsJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert questions to JSON");
        }

        Quiz savedQuiz = quizRepository.save(quiz);
        return mapToResponseDto(savedQuiz);
    }

    @Override
    public QuizResponseDto updateQuiz(Long id, QuizRequestDto quizRequestDto) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));

        quiz.setTitle(quizRequestDto.getTitle());
        quiz.setDescription(quizRequestDto.getDescription());
        quiz.setDifficulty(quizRequestDto.getDifficulty());
        quiz.setDuration(quizRequestDto.getDuration());
        quiz.setMarks(quizRequestDto.getMarks());
        quiz.setNegativeMarking(quizRequestDto.getNegativeMarking());
        quiz.setQuestionType(quizRequestDto.getQuestionType());

        try {
            String questionsJson = objectMapper.writeValueAsString(quizRequestDto.getQuestions());
            quiz.setQuestionsJson(questionsJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert questions to JSON");
        }

        Quiz updatedQuiz = quizRepository.save(quiz);
        return mapToResponseDto(updatedQuiz);
    }

    @Override
    public void deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
        quizRepository.delete(quiz);
    }

    @Override
    public QuizResponseDto getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
        return mapToResponseDto(quiz);
    }

    @Override
    public List<QuizResponseDto> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizResponseDto> quizResponseDtos = new ArrayList<>();
        for (Quiz quiz : quizzes) {
            quizResponseDtos.add(mapToResponseDto(quiz));
        }
        return quizResponseDtos;
    }
}
