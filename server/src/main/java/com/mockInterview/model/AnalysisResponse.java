package com.mockInterview.model;



import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnalysisResponse {
    private String status;
    private String message;
    private String audioFile;
    private String extractedText;
    private String contentType;
    private String keyTopics;
    private Integer communicationScore;
    private String roundScores;
    private Integer confidenceScore;
    private Integer clarityScore;
    private String overallRating;
    private String aiFeedback;
    private String improvementSuggestions;
    private String analyzedAi;
    private String contentAnalysis;
    private String aiRecommendations;
    private String skillInsights;
    private Integer recordId;

    // Constructors
    public AnalysisResponse() {}

    public AnalysisResponse(String message) {
        this.message = message;
        this.status = "error";
    }

    // Getters and Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAudioFile() { return audioFile; }
    public void setAudioFile(String audioFile) { this.audioFile = audioFile; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getKeyTopics() { return keyTopics; }
    public void setKeyTopics(String keyTopics) { this.keyTopics = keyTopics; }

    public Integer getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Integer communicationScore) { this.communicationScore = communicationScore; }

    public String getRoundScores() { return roundScores; }
    public void setRoundScores(String roundScores) { this.roundScores = roundScores; }

    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }

    public Integer getClarityScore() { return clarityScore; }
    public void setClarityScore(Integer clarityScore) { this.clarityScore = clarityScore; }

    public String getOverallRating() { return overallRating; }
    public void setOverallRating(String overallRating) { this.overallRating = overallRating; }

    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }

    public String getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }

    public String getAnalyzedAi() { return analyzedAi; }
    public void setAnalyzedAi(String analyzedAi) { this.analyzedAi = analyzedAi; }

    public String getContentAnalysis() { return contentAnalysis; }
    public void setContentAnalysis(String contentAnalysis) { this.contentAnalysis = contentAnalysis; }

    public String getAiRecommendations() { return aiRecommendations; }
    public void setAiRecommendations(String aiRecommendations) { this.aiRecommendations = aiRecommendations; }

    public String getSkillInsights() { return skillInsights; }
    public void setSkillInsights(String skillInsights) { this.skillInsights = skillInsights; }

    public Integer getRecordId() { return recordId; }
    public void setRecordId(Integer recordId) { this.recordId = recordId; }
}