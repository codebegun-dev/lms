package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Quiz;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.QuizRepository;
import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;
import com.mockInterview.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    // ---------------- CREATE ----------------
    @Override
    public QuizResponseDto createQuiz(QuizRequestDto quizRequestDto) {
        Quiz quiz = Quiz.builder()
                .title(quizRequestDto.getTitle())
                .description(quizRequestDto.getDescription())
                .timeLimitMin(quizRequestDto.getTimeLimitMin())
                .totalMarks(quizRequestDto.getTotalMarks())
                .isPublished(quizRequestDto.getIsPublished() != null ? quizRequestDto.getIsPublished() : false)
                .createdBy(quizRequestDto.getCreatedBy())
                .build();

        Quiz savedQuiz = quizRepository.save(quiz);
        return mapToResponseDto(savedQuiz);
    }

    // ---------------- UPDATE ----------------
    @Override
    public QuizResponseDto updateQuiz(Long quizId, QuizRequestDto quizRequestDto) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (!optionalQuiz.isPresent()) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }

        Quiz quiz = optionalQuiz.get();

        quiz.setTitle(quizRequestDto.getTitle());
        quiz.setDescription(quizRequestDto.getDescription());
        quiz.setTimeLimitMin(quizRequestDto.getTimeLimitMin());
        quiz.setTotalMarks(quizRequestDto.getTotalMarks());

        if (quizRequestDto.getIsPublished() != null) {
            quiz.setIsPublished(quizRequestDto.getIsPublished());
        }

        quiz.setUpdatedBy(quizRequestDto.getUpdatedBy());

        Quiz updatedQuiz = quizRepository.save(quiz);
        return mapToResponseDto(updatedQuiz);
    }

    // ---------------- GET BY ID ----------------
    @Override
    public QuizResponseDto getQuizById(Long quizId) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (!optionalQuiz.isPresent()) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }

        Quiz quiz = optionalQuiz.get();
        return mapToResponseDto(quiz);
    }

    // ---------------- GET ALL ----------------
    @Override
    public List<QuizResponseDto> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizResponseDto> responseList = new ArrayList<QuizResponseDto>();

        for (Quiz quiz : quizzes) {
            responseList.add(mapToResponseDto(quiz));
        }

        return responseList;
    }

    // ---------------- DELETE ----------------
    @Override
    public void deleteQuiz(Long quizId) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (!optionalQuiz.isPresent()) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }

        Quiz quiz = optionalQuiz.get();
        quizRepository.delete(quiz);
        
        
    }

    // ---------------- PUBLISH ----------------
    @Override
    public QuizResponseDto publishQuiz(Long quizId, Long updatedBy) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(quizId);
        if (!optionalQuiz.isPresent()) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }

        Quiz quiz = optionalQuiz.get();
        quiz.setIsPublished(true);
        quiz.setUpdatedBy(updatedBy);

        Quiz updatedQuiz = quizRepository.save(quiz);
        return mapToResponseDto(updatedQuiz);
    }

    // ---------------- UTILITY ----------------
    private QuizResponseDto mapToResponseDto(Quiz quiz) {
        return QuizResponseDto.builder()
                .quizId(quiz.getQuizId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimitMin(quiz.getTimeLimitMin())
                .totalMarks(quiz.getTotalMarks())
                .isPublished(quiz.getIsPublished())
                .createdBy(quiz.getCreatedBy())
                .updatedBy(quiz.getUpdatedBy())
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }
}
