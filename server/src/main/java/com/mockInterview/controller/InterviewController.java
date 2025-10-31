package com.mockInterview.controller;



//import com.mockInterview.requestDtos.InterviewRequest;
//import com.mockInterview.responseDtos.InterviewResponse;
//import com.mockInterview.models.QuestionBank;
//import com.mockInterview.service.*;
//import org.springframework.web.bind.annotation.*;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/interview")
//@CrossOrigin(origins = "*")
//public class InterviewController {
//
//    private final InterviewService interviewService;
//
//    public InterviewController(InterviewService interviewService) {
//        this.interviewService = interviewService;
//    }
//
//    @PostMapping("/start")
//    public InterviewResponse startInterview(@RequestBody InterviewRequest request) {
//        String sessionId = request.getSessionId() != null ? 
//            request.getSessionId() : UUID.randomUUID().toString();
//        
//        String firstQuestion = QuestionBank.getRandomQuestion(request.getLanguage());
//        
//        InterviewResponse response = new InterviewResponse(sessionId);
//        response.setQuestion(firstQuestion);
//        response.setNextQuestion(firstQuestion);
//        response.setInterviewComplete(false);
//        
//        return response;
//    }
//
//    @PostMapping("/answer")
//    public InterviewResponse processAnswer(@RequestBody InterviewRequest request) {
//        return interviewService.processInterviewAnswer(
//            request.getSessionId(),
//            request.getLanguage(),
//            request.getAudioData(),
//            request.getQuestion()
//        );
//    }
//
//    @GetMapping("/question/{language}")
//    public InterviewResponse getQuestion(@PathVariable String language,
//                                        @RequestParam(required = false) String sessionId) {
//        if (sessionId == null) {
//            sessionId = UUID.randomUUID().toString();
//        }
//        
//        String question = QuestionBank.getRandomQuestion(language);
//        
//        InterviewResponse response = new InterviewResponse(sessionId);
//        response.setQuestion(question);
//        response.setNextQuestion(question);
//        
//        return response;
//    }
//
//    @GetMapping("/health")
//    public String healthCheck() {
//        return "AI Interview System is running!";
//    }
//}
