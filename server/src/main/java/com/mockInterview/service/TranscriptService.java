package com.mockInterview.service;

public interface TranscriptService {
	
	String getTranscriptTextByInterviewId(Long interviewId);

    
    String getTranscriptTextById(Long transcriptId);
}
