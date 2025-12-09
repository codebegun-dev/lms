package com.mockInterview.controller;

import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;
import com.mockInterview.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // ---------------- CREATE ----------------
    @PostMapping
    public QuizResponseDto createQuiz(@Valid @RequestBody QuizRequestDto quizRequestDto) {
        return quizService.createQuiz(quizRequestDto);
    }

    // ---------------- UPDATE ----------------
    @PutMapping("/{quizId}")
    public QuizResponseDto updateQuiz(@PathVariable Long quizId,
                                      @Valid @RequestBody QuizRequestDto quizRequestDto) {
        return quizService.updateQuiz(quizId, quizRequestDto);
    }

    // ---------------- GET BY ID ----------------
    @GetMapping("/{quizId}")
    public QuizResponseDto getQuizById(@PathVariable Long quizId) {
        return quizService.getQuizById(quizId);
    }

    // ---------------- GET ALL ----------------
    @GetMapping
    public List<QuizResponseDto> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // ---------------- DELETE ----------------
    @DeleteMapping("/{quizId}")
    public String deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
        
        return "Quiz deleted successfully";
    }

    // ---------------- PUBLISH ----------------
    @PostMapping("/{quizId}/publish")
    public QuizResponseDto publishQuiz(@PathVariable Long quizId,
                                       @RequestParam Long updatedBy) {
        return quizService.publishQuiz(quizId, updatedBy);
    }
}
