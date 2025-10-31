//package com.mockInterview.aiEngine;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import com.mockInterview.responseDtos.ApiResponse;
//
//@RestController
//@RequestMapping("/api/ai")
//public class InterviewAIController {
//
//    @Autowired
//    private AiProcessingService aiService;
//
//    // ✅ Convert stored audio → transcript + save analysis
//    @PostMapping("/transcribe/{interviewId}")
//    public ApiResponse transcribe(@PathVariable Long interviewId) {
//        try {
//            String filePath = aiService.processAndAnalyze(interviewId);
//            return new ApiResponse(true,
//                    "Transcript generated & analysis saved successfully!",
//                    filePath);
//        } catch (Exception e) {
//            return new ApiResponse(false, "Error: " + e.getMessage(), null);
//        }
//    }
//}
