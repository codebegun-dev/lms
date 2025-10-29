package com.mockInterview.serviceImpl;

import com.mockInterview.apiAnalyzer.*;
import com.mockInterview.requestDtos.StudentInterviewRequestDto;
import com.mockInterview.responseDtos.*;
import com.mockInterview.entity.*;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.StudentInterviewMapper;
import com.mockInterview.repository.PerformanceAnalysisRepository;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.service.StudentInterviewService;
import com.mockInterview.util.FileStorageUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentInterviewServiceImpl implements StudentInterviewService {

    @Autowired
    private StudentInterviewRepository interviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PerformanceAnalysisRepository performanceAnalysisRepository;

    @Autowired
    private AudioAnalysisService audioAnalysisService;

    // ---------------- Start Interview ----------------
    @Override
    public StudentInterviewResponseDto startInterview(StudentInterviewRequestDto requestDto) {
        User student = userRepository.findById(requestDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + requestDto.getStudentId()));

        StudentInterview interview = new StudentInterview();
        interview.setStudent(student);
        interview.setRound(requestDto.getRoundType());
        interview.setStatus(InterviewStatus.ONGOING);
        interview.setStartTime(LocalDateTime.now());

        StudentInterview savedInterview = interviewRepository.save(interview);
        return StudentInterviewMapper.toDto(savedInterview);
    }

    // ---------------- Get Interviews ----------------
    @Override
    public List<StudentInterviewResponseDto> getInterviewsByStudent(Long studentId) {
        List<StudentInterview> interviews = interviewRepository.findByStudent_UserId(studentId);
        List<StudentInterviewResponseDto> dtoList = new ArrayList<>();
        for (StudentInterview interview : interviews) {
            dtoList.add(StudentInterviewMapper.toDto(interview));
        }
        return dtoList;
    }

    // ---------------- Complete Interview ----------------
    public StudentInterviewResponseDto completeInterview(Long interviewId) {
        StudentInterview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

        interview.setStatus(InterviewStatus.COMPLETED);
        interview.setEndTime(LocalDateTime.now());

        if (interview.getStartTime() != null) {
            Duration duration = Duration.between(interview.getStartTime(), interview.getEndTime());
            interview.setDurationSeconds(duration.getSeconds());
        }

        StudentInterview updated = interviewRepository.save(interview);
        return StudentInterviewMapper.toDto(updated);
    }

    @Override
    public InterviewSummaryResponse endInterview(Long interviewId, MultipartFile audioFile, MultipartFile videoFile) {
        try {
            StudentInterview interview = interviewRepository.findById(interviewId)
                    .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

            // Save audio/video
            String audioPath = FileStorageUtil.saveFile(audioFile, "interview_data/audio");
            String videoPath = FileStorageUtil.saveFile(videoFile, "interview_data/video");
            interview.setAudioPath(audioPath);
            interview.setVideoPath(videoPath);

            // Call Flask AI service
            AudioAnalysisResponse aiResponse = audioAnalysisService.analyzeAudio(new File(audioPath));

            // Save performance
            PerformanceAnalysis performance = new PerformanceAnalysis();
            performance.setInterview(interview);
            performance.setTechnicalScore(aiResponse.getTechnicalScore());
            performance.setHrScore(aiResponse.getHrScore());
            performance.setBehavioralScore(aiResponse.getBehavioralScore());
            performance.setCommunicationScore(aiResponse.getCommunicationScore());
            performance.setConfidenceScore(aiResponse.getConfidenceScore());
            performance.setClarityScore(aiResponse.getClarityScore());
            performance.setUnderstandingScore(aiResponse.getUnderstandingScore());
            performance.setOverallRating(aiResponse.getOverallRating());
            performance.setAiFeedback(aiResponse.getAiFeedback());
            performance.setImprovementSuggestions(aiResponse.getImprovementSuggestions());
            performance.setAnalyzedAt(java.time.LocalDateTime.now());

            performanceAnalysisRepository.save(performance);

            // Complete interview
            interview.setStatus(InterviewStatus.COMPLETED);
            interview.setEndTime(java.time.LocalDateTime.now());
            interviewRepository.save(interview);

            // Prepare response
            InterviewSummaryResponse summary = new InterviewSummaryResponse();
            summary.setInterviewId(interview.getId());
            summary.setStudentName(interview.getStudent().getFirstName() + " " + interview.getStudent().getLastName());
            summary.setRound(interview.getRound().name());
            summary.setCommunicationScore(performance.getCommunicationScore());
            summary.setConfidenceScore(performance.getConfidenceScore());
            summary.setClarityScore(performance.getClarityScore());
            summary.setOverallRating(performance.getOverallRating());
            summary.setAiFeedback(performance.getAiFeedback());
            summary.setImprovementSuggestions(performance.getImprovementSuggestions());
            summary.setStatus("COMPLETED");

            return summary;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error while ending interview: " + e.getMessage());
        }
    }



}
