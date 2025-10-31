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

    // ✅ Add Question
    @PostMapping
    public QuestionBankResponseDto addQuestion(@RequestBody QuestionBankDto dto) {
        return questionBankService.addQuestion(dto);
    }

    

    // ✅ Update Question
    @PutMapping("/{id}")
    public QuestionBankResponseDto updateQuestion(@PathVariable Long id, @RequestBody QuestionBankDto dto) {
        return questionBankService.updateQuestion(id, dto);
    }

    // ✅ Get Question by ID
    @GetMapping("/{id}")
    public QuestionBankResponseDto getQuestionById(@PathVariable Long id) {
        return questionBankService.getQuestionById(id);
    }

    // ✅ Get All Questions
    @GetMapping
    public List<QuestionBankResponseDto> getAllQuestions() {
        return questionBankService.getAllQuestions();
    }

    // ✅ Get Questions by SubTopic ID
    @GetMapping("/subtopic/{subTopicId}")
    public List<QuestionBankResponseDto> getQuestionsBySubTopic(@PathVariable Long subTopicId) {
        return questionBankService.getQuestionsBySubTopicId(subTopicId);
    }

    // ✅ Search using IDs
    @GetMapping("/search")
    public List<QuestionBankResponseDto> searchQuestions(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Long subTopicId,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String title
    ) {
        return questionBankService.searchQuestions(categoryId, topicId, subTopicId, difficulty, title);
    }

    // ✅ Search using Names
    @GetMapping("/filter")
    public List<QuestionBankResponseDto> getQuestionsByFilters(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String subTopic,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String title
    ) {
        return questionBankService.getQuestionsByFilters(category, topic, subTopic, difficulty, title);
    }

    // ✅ Delete Question
    @DeleteMapping("/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        questionBankService.deleteQuestion(id);
        return "Question deleted successfully with ID: " + id;
    }
    
    
    @GetMapping("/random")
    public List<QuestionBankResponseDto> getRandomQuestionsByCategory(@RequestParam Long categoryId) {
        return questionBankService.getRandomQuestionsByCategory(categoryId);
    }


}
