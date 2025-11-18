package com.mockInterview.requestDtos;

import lombok.Data;

@Data
public class AnalyzeRequest {
	
	private Long interviewId;
    private String transcriptText;

}
