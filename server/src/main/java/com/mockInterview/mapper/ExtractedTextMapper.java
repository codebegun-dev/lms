package com.mockInterview.mapper;

import com.mockInterview.entity.ExtractedText;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.requestDtos.ExtractedTextRequestDto;
import com.mockInterview.responseDtos.ExtractedTextDto;

public class ExtractedTextMapper {

    public static ExtractedText toEntity(ExtractedTextRequestDto dto, StudentInterview interview) {
        if (dto == null) return null;
        ExtractedText entity = new ExtractedText();
        entity.setInterview(interview);
        entity.setTranscript(dto.getTranscript());
        return entity;
    }

    public static ExtractedTextDto toDto(ExtractedText entity) {
        if (entity == null) return null;
        ExtractedTextDto dto = new ExtractedTextDto();
        dto.setInterviewId(entity.getInterview().getId()); // fetch interview ID from entity
        dto.setTranscript(entity.getTranscript());
        dto.setExtractedAt(entity.getExtractedAt());
        return dto;
    }
}
