package com.mockInterview.controller;

import com.mockInterview.requestDtos.QuestionBankDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.service.QuestionBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionBankController {

    @Autowired
    private QuestionBankService questionBankService;

    @PostMapping
    public QuestionBankResponseDto addQuestion(@RequestBody QuestionBankDto dto) {
        return questionBankService.addQuestion(dto);
    }

    @PutMapping("/{id}")
    public QuestionBankResponseDto updateQuestion(@PathVariable Long id,
                                                  @RequestBody QuestionBankDto dto) {
        return questionBankService.updateQuestion(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        questionBankService.deleteQuestion(id);
        return "Question deleted successfully";
    }

    @GetMapping
    public List<QuestionBankResponseDto> getAllQuestions() {
        return questionBankService.getAllQuestions();
    }

    @GetMapping("/search")
    public List<QuestionBankResponseDto> searchQuestions(@RequestParam("q") String keyword) {
        return questionBankService.searchQuestions(keyword);
    }
}
