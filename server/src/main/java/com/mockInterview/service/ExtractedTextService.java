package com.mockInterview.service;

import com.mockInterview.requestDtos.ExtractedTextRequestDto;
import com.mockInterview.responseDtos.ExtractedTextDto;

public interface ExtractedTextService {

    ExtractedTextDto saveExtractedText(ExtractedTextRequestDto requestDto);

    ExtractedTextDto getExtractedTextByInterview(Long interviewId);
}
