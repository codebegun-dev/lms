package com.mockInterview.controller;

import com.mockInterview.responseDtos.QuestionCategoryCountDto;
import com.mockInterview.service.QuestionBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions/analytics")
@CrossOrigin(origins = "*")
public class QuestionAnalyticsController {

    @Autowired
    private QuestionBankService questionBankService;

    // ✅ Get Dynamic Question Count by Category
    @GetMapping("/count-by-category")
    public QuestionCategoryCountDto getQuestionCountsByCategory() {
        return questionBankService.getQuestionCountsByCategory();
    }

    

}
