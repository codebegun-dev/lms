package com.mockInterview.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;
import com.mockInterview.service.QuizService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // Create quiz
    @PostMapping
    public QuizResponseDto createQuiz(@Valid @RequestBody QuizRequestDto quizRequestDto) {
        return quizService.createQuiz(quizRequestDto);
    }

    // Update quiz
    @PutMapping("/{id}")
    public QuizResponseDto updateQuiz(@PathVariable Long id,
                                      @Valid @RequestBody QuizRequestDto quizRequestDto) {
        return quizService.updateQuiz(id, quizRequestDto);
    }

    // Delete quiz
    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
    }

    // Get quiz by ID
    @GetMapping("/{id}")
    public QuizResponseDto getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    // Get all quizzes
    @GetMapping
    public List<QuizResponseDto> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }
}
