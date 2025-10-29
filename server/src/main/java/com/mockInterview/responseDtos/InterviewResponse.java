package com.mockInterview.responseDtos;



import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class InterviewResponse {
    private String sessionId;
    private String question;
    private String userAnswer;
    private String aiFeedback;
    private int qualityScore;
    private int wordCount;
    private boolean needsRetry;
    private String nextQuestion;
    private boolean interviewComplete;
    private String finalFeedback;
    private Integer finalRating;

    public InterviewResponse(String sessionId) {
        this.sessionId = sessionId;
    }

    // Getters and Setters
    @JsonProperty("sessionId")
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    @JsonProperty("question")
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    @JsonProperty("userAnswer")
    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

    @JsonProperty("aiFeedback")
    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }

    @JsonProperty("qualityScore")
    public int getQualityScore() { return qualityScore; }
    public void setQualityScore(int qualityScore) { this.qualityScore = qualityScore; }

    @JsonProperty("wordCount")
    public int getWordCount() { return wordCount; }
    public void setWordCount(int wordCount) { this.wordCount = wordCount; }

    @JsonProperty("needsRetry")
    public boolean isNeedsRetry() { return needsRetry; }
    public void setNeedsRetry(boolean needsRetry) { this.needsRetry = needsRetry; }

    @JsonProperty("nextQuestion")
    public String getNextQuestion() { return nextQuestion; }
    public void setNextQuestion(String nextQuestion) { this.nextQuestion = nextQuestion; }

    @JsonProperty("interviewComplete")
    public boolean isInterviewComplete() { return interviewComplete; }
    public void setInterviewComplete(boolean interviewComplete) { this.interviewComplete = interviewComplete; }

    @JsonProperty("finalFeedback")
    public String getFinalFeedback() { return finalFeedback; }
    public void setFinalFeedback(String finalFeedback) { this.finalFeedback = finalFeedback; }

    @JsonProperty("finalRating")
    public Integer getFinalRating() { return finalRating; }
    public void setFinalRating(Integer finalRating) { this.finalRating = finalRating; }
}