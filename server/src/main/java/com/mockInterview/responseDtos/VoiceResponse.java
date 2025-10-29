package com.mockInterview.responseDtos;



public class VoiceResponse {
 private String text;
 private String audioBase64;
 private String question;
 private String sessionId;
 private String status;

 // Constructors, Getters and Setters
 public VoiceResponse() {}
 
 public String getText() { return text; }
 public void setText(String text) { this.text = text; }
 public String getAudioBase64() { return audioBase64; }
 public void setAudioBase64(String audioBase64) { this.audioBase64 = audioBase64; }
 public String getQuestion() { return question; }
 public void setQuestion(String question) { this.question = question; }
 public String getSessionId() { return sessionId; }
 public void setSessionId(String sessionId) { this.sessionId = sessionId; }
 public String getStatus() { return status; }
 public void setStatus(String status) { this.status = status; }
}
