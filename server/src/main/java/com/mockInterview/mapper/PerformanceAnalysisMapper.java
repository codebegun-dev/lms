package com.mockInterview.mapper;

import com.mockInterview.entity.PerformanceAnalysis;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.requestDtos.PerformanceAnalysisRequestDto;
import com.mockInterview.responseDtos.PerformanceAnalysisDto;

public class PerformanceAnalysisMapper {

    public static PerformanceAnalysis toEntity(PerformanceAnalysisRequestDto dto, StudentInterview interview) {
        if (dto == null) return null;

        PerformanceAnalysis entity = new PerformanceAnalysis();
        entity.setInterview(interview);

        // Round-specific scores
        entity.setTechnicalScore(dto.getTechnicalScore());
        entity.setHrScore(dto.getHrScore());
        entity.setBehavioralScore(dto.getBehavioralScore());

        // Universal score
        entity.setCommunicationScore(dto.getCommunicationScore());

        entity.setConfidenceScore(dto.getConfidenceScore());
        entity.setClarityScore(dto.getClarityScore());
        entity.setUnderstandingScore(dto.getUnderstandingScore());
        entity.setOverallRating(dto.getOverallRating());
        entity.setAiFeedback(dto.getAiFeedback());
        entity.setImprovementSuggestions(dto.getImprovementSuggestions());

        return entity;
    }

    public static PerformanceAnalysisDto toDto(PerformanceAnalysis entity) {
        if (entity == null) return null;

        PerformanceAnalysisDto dto = new PerformanceAnalysisDto();
        dto.setInterviewId(entity.getInterview().getId());

        // Round-specific scores
        dto.setTechnicalScore(entity.getTechnicalScore());
        dto.setHrScore(entity.getHrScore());
        dto.setBehavioralScore(entity.getBehavioralScore());

        // Universal score
        dto.setCommunicationScore(entity.getCommunicationScore());

        dto.setConfidenceScore(entity.getConfidenceScore());
        dto.setClarityScore(entity.getClarityScore());
        dto.setUnderstandingScore(entity.getUnderstandingScore());
        dto.setOverallRating(entity.getOverallRating());
        dto.setAiFeedback(entity.getAiFeedback());
        dto.setImprovementSuggestions(entity.getImprovementSuggestions());
        dto.setAnalyzedAt(entity.getAnalyzedAt());

        return dto;
    }
}
