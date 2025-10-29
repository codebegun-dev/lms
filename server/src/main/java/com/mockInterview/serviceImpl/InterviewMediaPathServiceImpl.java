package com.mockInterview.serviceImpl;

import com.mockInterview.entity.InterviewMediaPath;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.InterviewMediaPathMapper;
import com.mockInterview.repository.InterviewMediaPathRepository;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.requestDtos.InterviewMediaPathRequestDto;
import com.mockInterview.responseDtos.InterviewMediaPathDto;
import com.mockInterview.service.InterviewMediaPathService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterviewMediaPathServiceImpl implements InterviewMediaPathService {

    @Autowired
    private InterviewMediaPathRepository mediaRepository;

    @Autowired
    private StudentInterviewRepository interviewRepository;

    @Override
    public InterviewMediaPathDto saveMediaPath(InterviewMediaPathRequestDto requestDto) {
        // Fetch the linked StudentInterview
        StudentInterview interview = interviewRepository.findById(requestDto.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview not found with id: " + requestDto.getInterviewId()));

        // Map DTO to Entity with linked interview
        InterviewMediaPath media = InterviewMediaPathMapper.toEntity(requestDto, interview);

        // Save entity
        media = mediaRepository.save(media);

        // Return DTO
        return InterviewMediaPathMapper.toDto(media);
    }

    @Override
    public InterviewMediaPathDto getMediaPathByInterviewId(Long interviewId) {
        InterviewMediaPath media = mediaRepository.findByInterview_Id(interviewId);
        if (media == null) {
            throw new ResourceNotFoundException("Media paths not found for interview id: " + interviewId);
        }
        return InterviewMediaPathMapper.toDto(media);
    }
}
