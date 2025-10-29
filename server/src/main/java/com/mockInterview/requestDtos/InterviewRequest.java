package com.mockInterview.requestDtos;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class InterviewRequest {
    private String language;
    private String audioData; // Base64 encoded audio
    private String question;
    private String sessionId;

    @JsonCreator
    public InterviewRequest(@JsonProperty("language") String language,
                           @JsonProperty("audioData") String audioData,
                           @JsonProperty("question") String question,
                           @JsonProperty("sessionId") String sessionId) {
        this.language = language;
        this.audioData = audioData;
        this.question = question;
        this.sessionId = sessionId;
    }

    // Getters and Setters
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public String getAudioData() { return audioData; }
    public void setAudioData(String audioData) { this.audioData = audioData; }
    
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}


