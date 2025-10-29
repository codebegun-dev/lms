package com.mockInterview.serviceImpl;

import com.mockInterview.entity.ExtractedText;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.ExtractedTextMapper;
import com.mockInterview.repository.ExtractedTextRepository;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.requestDtos.ExtractedTextRequestDto;
import com.mockInterview.responseDtos.ExtractedTextDto;
import com.mockInterview.service.ExtractedTextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExtractedTextServiceImpl implements ExtractedTextService {

    @Autowired
    private ExtractedTextRepository extractedTextRepository;

    @Autowired
    private StudentInterviewRepository interviewRepository;

    @Override
    public ExtractedTextDto saveExtractedText(ExtractedTextRequestDto requestDto) {

        // Fetch the interview
        StudentInterview interview = interviewRepository.findById(requestDto.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview not found with id: " + requestDto.getInterviewId()));

        // Convert DTO to entity
        ExtractedText extractedText = ExtractedTextMapper.toEntity(requestDto, interview);

        // Save entity
        ExtractedText saved = extractedTextRepository.save(extractedText);

        // Convert back to DTO
        return ExtractedTextMapper.toDto(saved);
    }

    @Override
    public ExtractedTextDto getExtractedTextByInterview(Long interviewId) {

        ExtractedText extractedText = extractedTextRepository.findByInterview_Id(interviewId);

        if (extractedText == null) {
            throw new ResourceNotFoundException("Extracted text not found for interview id: " + interviewId);
        }

        return ExtractedTextMapper.toDto(extractedText);
    }
}
