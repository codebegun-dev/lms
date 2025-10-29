package com.mockInterview.serviceImpl;

import com.mockInterview.entity.PerformanceAnalysis;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.PerformanceAnalysisMapper;
import com.mockInterview.repository.PerformanceAnalysisRepository;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.requestDtos.PerformanceAnalysisRequestDto;
import com.mockInterview.responseDtos.PerformanceAnalysisDto;
import com.mockInterview.service.PerformanceAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PerformanceAnalysisServiceImpl implements PerformanceAnalysisService {

    @Autowired
    private PerformanceAnalysisRepository performanceRepository;

    @Autowired
    private StudentInterviewRepository interviewRepository;

    @Override
    public PerformanceAnalysisDto savePerformanceAnalysis(PerformanceAnalysisRequestDto requestDto) {

        StudentInterview interview = interviewRepository.findById(requestDto.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview not found with id: " + requestDto.getInterviewId()));

        PerformanceAnalysis performance = PerformanceAnalysisMapper.toEntity(requestDto, interview);

        PerformanceAnalysis saved = performanceRepository.save(performance);

        return PerformanceAnalysisMapper.toDto(saved);
    }

    @Override
    public PerformanceAnalysisDto getPerformanceAnalysisByInterview(Long interviewId) {

        PerformanceAnalysis performance = performanceRepository.findByInterview_Id(interviewId);

        if (performance == null) {
            throw new ResourceNotFoundException("Performance analysis not found for interview id: " + interviewId);
        }

        return PerformanceAnalysisMapper.toDto(performance);
    }
}
