package com.mockInterview.controller;

import com.mockInterview.requestDtos.QuestionRequestDto;
import com.mockInterview.responseDtos.QuestionResponseDto;
import com.mockInterview.service.QuestionService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzquestions")
public class QuestionController {

    @Autowired
    private QuestionService questionsService;

    // ---------------- CREATE ----------------
    @PostMapping
    public QuestionResponseDto createQuestion(@Valid @RequestBody QuestionRequestDto questionRequestDto) {
        return questionsService.createQuestion(questionRequestDto);
    }

    // ---------------- UPDATE ----------------
    @PutMapping("/{questionId}")
    public QuestionResponseDto updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequestDto questionRequestDto) {
        return questionsService.updateQuestion(questionId, questionRequestDto);
    }

    // ---------------- GET BY ID ----------------
    @GetMapping("/{questionId}")
    public QuestionResponseDto getQuestionById(@PathVariable Long questionId) {
        return questionsService.getQuestionById(questionId);
    }

    // ---------------- GET BY QUIZ ----------------
    @GetMapping("/quiz/{quizId}")
    public List<QuestionResponseDto> getQuestionsByQuiz(@PathVariable Long quizId) {
        return questionsService.getQuestionsByQuizId(quizId);
    }

    // ---------------- DELETE ----------------
    @DeleteMapping("/{questionId}")
    public String deleteQuestion(@PathVariable Long questionId) {
        questionsService.deleteQuestion(questionId);
        return "Question deleted successfully with ID: " + questionId;
    }
}
