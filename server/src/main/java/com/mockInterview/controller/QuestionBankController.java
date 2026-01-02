package com.mockInterview.controller;

import com.mockInterview.requestDtos.QuestionBankDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.responseDtos.QuestionCategoryCountDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.QuestionBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@ModulePermission("QUESTION_BANK_MANAGEMENT")
@CrossOrigin(origins = "*")
public class QuestionBankController {

    @Autowired
    private QuestionBankService questionBankService;

    // ✅ Add Question
    @PreAuthorize("hasAuthority('CREATE_QUESTION')")
    @PostMapping
    public QuestionBankResponseDto addQuestion(@RequestBody QuestionBankDto dto) {
        return questionBankService.addQuestion(dto);
    }

    // ✅ Update Question
    @PreAuthorize("hasAuthority('UPDATE_QUESTION')")
    @PutMapping("/{id}")
    public QuestionBankResponseDto updateQuestion(@PathVariable Long id, @RequestBody QuestionBankDto dto) {
        return questionBankService.updateQuestion(id, dto);
    }

    // ✅ Get Question by ID
//    @PreAuthorize("hasAuthority('VIEW_QUESTION')")
    @GetMapping("/{id}")
    public QuestionBankResponseDto getQuestionById(@PathVariable Long id) {
        return questionBankService.getQuestionById(id);
    }

    // ✅ Get All Questions
//    @PreAuthorize("hasAuthority('VIEW_QUESTION')")
    @GetMapping
    public List<QuestionBankResponseDto> getAllQuestions() {
        return questionBankService.getAllQuestions();
    }

    // ✅ Get Questions by SubTopic ID
//    @PreAuthorize("hasAuthority('VIEW_QUESTION')")
    @GetMapping("/subtopic/{subTopicId}")
    public List<QuestionBankResponseDto> getQuestionsBySubTopic(@PathVariable Long subTopicId) {
        return questionBankService.getQuestionsBySubTopicId(subTopicId);
    }

    // ✅ Search using IDs
//    @PreAuthorize("hasAuthority('VIEW_QUESTION')")
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
//    @PreAuthorize("hasAuthority('VIEW_QUESTION')")
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
    @PreAuthorize("hasAuthority('DELETE_QUESTION')")
    @DeleteMapping("/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        questionBankService.deleteQuestion(id);
        return "Question deleted successfully with ID: " + id;
    }

    // ✅ Get Random Questions by Category
//    @PreAuthorize("hasAuthority('VIEW_QUESTION')")
    @GetMapping("/random")
    public List<QuestionBankResponseDto> getRandomQuestionsByCategory(@RequestParam Long categoryId) {
        return questionBankService.getRandomQuestionsByCategory(categoryId);
    }

    // ✅ Get Question Counts by Category
//    @PreAuthorize("hasAuthority('VIEW_STATS')")
    @GetMapping("/count-by-category")
    public QuestionCategoryCountDto getQuestionCountsByCategory() {
        return questionBankService.getQuestionCountsByCategory();
    }
}
