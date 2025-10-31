package com.mockInterview.requestDtos;


public class VoiceInterviewRequest {
 private String language;
 private String sessionId;
 private String question;

 // Constructors
 public VoiceInterviewRequest() {}
 
 public VoiceInterviewRequest(String language, String sessionId) {
     this.language = language;
     this.sessionId = sessionId;
 }

 // Getters and Setters
 public String getLanguage() { return language; }
 public void setLanguage(String language) { this.language = language; }
 public String getSessionId() { return sessionId; }
 public void setSessionId(String sessionId) { this.sessionId = sessionId; }
 public String getQuestion() { return question; }
 public void setQuestion(String question) { this.question = question; }
}
