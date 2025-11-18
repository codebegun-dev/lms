package com.mockInterview.aiEngine;

import com.mockInterview.entity.StudentInterview;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.requestDtos.AnalyzeRequest;
import com.mockInterview.responseDtos.TextFeedbackResponseDto;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
@RequiredArgsConstructor
public class TextAnalysisController {

    private final TextAnalysisService textAnalysisService;
    private final StudentInterviewRepository interviewRepository;

    /**
     * Analyze transcript and save feedback
     */
    @PostMapping("/analyze")
    public TextFeedbackResponseDto analyzeText(@RequestBody AnalyzeRequest request) {

        // Fetch interview
        StudentInterview interview = interviewRepository.findById(request.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + request.getInterviewId()));

        // Analyze transcript and save feedback
        return textAnalysisService.analyzeText(request.getTranscriptText(), interview);
    }

    
    @GetMapping("/{interviewId}")
    public TextFeedbackResponseDto getPerformanceByInterviewId(@PathVariable Long interviewId) {
        TextFeedbackResponseDto feedbackDto = textAnalysisService.getPerformanceByInterviewId(interviewId);
        if (feedbackDto == null) {
            throw new ResourceNotFoundException("Performance not found for interview: " + interviewId);
        }
        return feedbackDto;
    }
}
