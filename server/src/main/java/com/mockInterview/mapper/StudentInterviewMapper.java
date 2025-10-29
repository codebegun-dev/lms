package com.mockInterview.mapper;

import com.mockInterview.entity.StudentInterview;
import com.mockInterview.responseDtos.StudentInterviewResponseDto;

public class StudentInterviewMapper {

    public static StudentInterviewResponseDto toDto(StudentInterview entity) {
        if (entity == null) return null;

        StudentInterviewResponseDto dto = new StudentInterviewResponseDto();
        dto.setInterviewId(entity.getId());
        dto.setStudentId(entity.getStudent() != null ? entity.getStudent().getUserId() : null);
        dto.setRound(entity.getRound());
        dto.setStatus(entity.getStatus());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setDurationSeconds(entity.getDurationSeconds());
        return dto;
    }
}
