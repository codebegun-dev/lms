package com.mockInterview.controller;

import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;
import com.mockInterview.service.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // ---------------- CREATE ----------------
    @PreAuthorize("hasAuthority('CREATE_QUIZ')")
    @PostMapping
    public QuizResponseDto createQuiz(@RequestBody QuizRequestDto dto) {
        return quizService.createQuiz(dto);
    }

    // ---------------- UPDATE ----------------
    @PreAuthorize("hasAuthority('UPDATE_QUIZ')")
    @PutMapping("/{id}")
    public QuizResponseDto updateQuiz(
            @PathVariable Long id,
            @RequestBody QuizRequestDto dto) {

        return quizService.updateQuiz(id, dto);
    }

    // ---------------- READ BY ID ----------------
    @PreAuthorize("hasAuthority('VIEW_QUIZ')")
    @GetMapping("/{id}")
    public QuizResponseDto getQuiz(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    // ---------------- READ ALL ----------------
    @PreAuthorize("hasAuthority('VIEW_QUIZ')")
    @GetMapping
    public List<QuizResponseDto> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // ---------------- DELETE ----------------
    @PreAuthorize("hasAuthority('DELETE_QUIZ')")
    @DeleteMapping("/{id}")
    public String deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return "Quiz deleted successfully";
    }
}
