package com.mockInterview.mapper;

import com.mockInterview.entity.InterviewMediaPath;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.requestDtos.InterviewMediaPathRequestDto;
import com.mockInterview.responseDtos.InterviewMediaPathDto;

public class InterviewMediaPathMapper {

    // Create new entity from DTO + StudentInterview
    public static InterviewMediaPath toEntity(InterviewMediaPathRequestDto dto, StudentInterview interview) {
        if (dto == null || interview == null) return null;

        InterviewMediaPath entity = new InterviewMediaPath();
        entity.setInterview(interview); // link the interview entity
        entity.setVideoPath(dto.getVideoPath());
        entity.setAudioPath(dto.getAudioPath());

        return entity;
    }

    // Convert entity to DTO
    public static InterviewMediaPathDto toDto(InterviewMediaPath entity) {
        if (entity == null) return null;
        InterviewMediaPathDto dto = new InterviewMediaPathDto();
        dto.setInterviewId(entity.getInterview().getId());
        dto.setVideoPath(entity.getVideoPath());
        dto.setAudioPath(entity.getAudioPath());
        return dto;
    }
}
