package com.mockInterview.aiEngine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.entity.TextFeedback;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.repository.TextFeedbackRepository;

import com.mockInterview.responseDtos.TextFeedbackResponseDto;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TextAnalysisService {

//   @Value("${openai.api.key}") 
    private String  apiKey;

    @Autowired
    private StudentInterviewRepository studentInterviewRepository;

    @Autowired
    private TextFeedbackRepository textFeedbackRepository;

    // ------------------------
    // Analyze transcript & save feedback
    // ------------------------
    public TextFeedbackResponseDto analyzeText(String transcriptText, StudentInterview interview) {
        OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(120));

        ChatMessage system = new ChatMessage("system",
                "You are an expert communication evaluator. Analyze the user's text and return STRICT JSON:\n" +
                        "{\n" +
                        "  \"communication_score\": 0-10,\n" +
                        "  \"confidence_score\": 0-10,\n" +
                        "  \"category_round_type_score\": 0-10,\n" +
                        "  \"overall_rating\": 0-10,\n" +
                        "  \"improvement_suggestions\": \"text\"\n" +
                        "}\n" +
                        "Return only valid JSON, no extra text."
        );

        ChatMessage user = new ChatMessage("user", transcriptText);

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(java.util.List.of(system, user))
                .maxTokens(500)
                .build();

        String result = service.createChatCompletion(request)
                .getChoices().get(0).getMessage().getContent();

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(result);

            TextFeedback feedback = new TextFeedback();
            feedback.setInterview(interview);
            feedback.setCategory(interview.getCategory());
            feedback.setCommunicationScore(json.path("communication_score").asInt(0));
            feedback.setConfidenceScore(json.path("confidence_score").asInt(0));
            feedback.setCategoryRoundTypeScore(json.path("category_round_type_score").asInt(0));
            feedback.setOverallRating(json.path("overall_rating").asDouble(0.0));
            feedback.setImprovementSuggestions(json.path("improvement_suggestions").asText(""));
            feedback.setCreatedAt(LocalDateTime.now().toString());

            TextFeedback savedFeedback = textFeedbackRepository.save(feedback);

            return mapToDto(savedFeedback);

        } catch (Exception e) {
            throw new RuntimeException("Invalid JSON from AI: " + result, e);
        }
    }

    // ------------------------
    // Get performance by interview ID
    // ------------------------
    public TextFeedbackResponseDto getPerformanceByInterviewId(Long interviewId) {
        Optional<StudentInterview> optionalInterview = studentInterviewRepository.findById(interviewId);
        if (optionalInterview.isEmpty()) return null;

        StudentInterview interview = optionalInterview.get();

        Optional<TextFeedback> optionalFeedback = textFeedbackRepository.findByInterview(interview);
        if (optionalFeedback.isEmpty()) return null;

        return mapToDto(optionalFeedback.get());
    }

    // ------------------------
    // Map entity to DTO
    // ------------------------
    private TextFeedbackResponseDto mapToDto(TextFeedback feedback) {
        TextFeedbackResponseDto dto = new TextFeedbackResponseDto();
        dto.setId(feedback.getId());
        dto.setInterviewId(feedback.getInterview().getId());
        dto.setCategoryName(feedback.getCategory() != null ? feedback.getCategory().getName() : null);
        dto.setCommunicationScore(feedback.getCommunicationScore());
        dto.setConfidenceScore(feedback.getConfidenceScore());
        dto.setCategoryRoundTypeScore(feedback.getCategoryRoundTypeScore());
        dto.setOverallRating(feedback.getOverallRating());
        dto.setImprovementSuggestions(feedback.getImprovementSuggestions());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }
}

