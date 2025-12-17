package com.mockInterview.serviceImpl;

import com.mockInterview.aiEngine.WhisperProcessService;
import com.mockInterview.entity.*;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.StudentInterviewMapper;
import com.mockInterview.repository.*;
import com.mockInterview.requestDtos.StudentInterviewRequestDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.responseDtos.StartInterviewResponseDto;
import com.mockInterview.responseDtos.StudentInterviewResponseDto;
import com.mockInterview.service.QuestionBankService;
import com.mockInterview.service.StudentInterviewService;
import com.mockInterview.util.FileStorageUtil;

import java.time.Duration;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentInterviewServiceImpl implements StudentInterviewService {

    @Autowired
    private StudentInterviewRepository interviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuestionBankService questionBankService;
    
    
    @Autowired
    InterviewMediaRepository interviewMediaRepository;
    
    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;
    
    @Autowired
    private WhisperProcessService whisperProcessService;
    

    // -------------------- START INTERVIEW --------------------
    

    @Override
    public StartInterviewResponseDto startInterview(StudentInterviewRequestDto requestDto) {

        User student = userRepository.findById(requestDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found: " + requestDto.getStudentId()));

        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found: " + requestDto.getCategoryId()));

        StudentInterview interview = StudentInterview.builder()
                .student(student)
                .category(category)
                .status(InterviewStatus.ONGOING)
                .startTime(LocalDateTime.now())
                .build();

        interview = interviewRepository.save(interview);

        // ✅ Get random questions
        List<QuestionBankResponseDto> randomQuestions =
                questionBankService.getRandomQuestionsByCategory(category.getId());

        int order = 1;
        for (QuestionBankResponseDto q : randomQuestions) {

            InterviewQuestion iq = InterviewQuestion.builder()
                    .interview(interview)
                    .questionId(q.getId())
                    .askedOrder(order++)
                    .build();

            interviewQuestionRepository.save(iq);
        }

        // ✅ Create response object
        StartInterviewResponseDto resp = new StartInterviewResponseDto();
        StudentInterviewResponseDto dto = StudentInterviewMapper.toDto(interview);
        dto.setCategoryName(category.getName());

        resp.setInterview(dto);
        resp.setFirstQuestion(randomQuestions.get(0)); // return only first question

        return resp;
    }



    @Override
    public QuestionBankResponseDto getNextQuestion(Long interviewId) {

        InterviewQuestion next = interviewQuestionRepository
                .findTopByInterviewIdAndAnsweredFalseOrderByAskedOrderAsc(interviewId);

        if (next == null) {
            throw new ResourceNotFoundException("No more questions in interview");
        }

        next.setAnswered(true);
        interviewQuestionRepository.save(next);

        return questionBankService.getQuestionById(next.getQuestionId());
    }


    // -------------------- GET ALL INTERVIEWS BY STUDENT --------------------
    @Override
    public List<StudentInterviewResponseDto> getInterviewsByStudent(Long studentId) {
        List<StudentInterview> interviews = interviewRepository.findByStudent_UserId(studentId);

        return interviews.stream()
                .map(StudentInterviewMapper::toDto)
                .toList();
    }
    
    

    @Override
    public StudentInterviewResponseDto endInterview(Long interviewId, MultipartFile videoFile, MultipartFile audioFile) {

        StudentInterview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        // ✅ Update interview status & time
        interview.setStatus(InterviewStatus.COMPLETED);
        interview.setEndTime(LocalDateTime.now());

        if (interview.getStartTime() != null) {
//            long duration = Duration.between(interview.getStartTime(), interview.getEndTime()).getSeconds();
//            interview.setDurationSeconds(duration);
        	
        	Duration duration = Duration.between(interview.getStartTime(), interview.getEndTime());
        	long totalSeconds = duration.getSeconds();

        	long minutes = totalSeconds / 60;
        	long seconds = totalSeconds % 60;

        	String formattedDuration = String.format("%d:%02d", minutes, seconds);
        	interview.setDuration(formattedDuration);

        }

        interviewRepository.save(interview);

        String videoPath = null;
        String audioPath = null;

        try {
            Long studentId = interview.getStudent().getUserId();

            videoPath = FileStorageUtil.saveFile(videoFile, studentId, "interviews/" + interviewId + "/video");
            audioPath = FileStorageUtil.saveFile(audioFile, studentId, "interviews/" + interviewId + "/audio");

        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }

        // ✅ Prevent Duplicate Media Row — UPSERT Logic
        InterviewMedia existingMedia = interviewMediaRepository.findByInterviewId(interviewId);

        if (existingMedia != null) {
            // Delete old files before replacing
        	FileStorageUtil.deleteFile(existingMedia.getAudioPath());
        	FileStorageUtil.deleteFile(existingMedia.getVideoPath());

            existingMedia.setAudioPath(audioPath);
            existingMedia.setVideoPath(videoPath);

            interviewMediaRepository.save(existingMedia);
        } else {
            InterviewMedia media = InterviewMedia.builder()
                    .interview(interview)
                    .videoPath(videoPath)
                    .audioPath(audioPath)
                    .build();

            interviewMediaRepository.save(media);
        }

        // ✅ Auto-run Whisper transcription asynchronously
        try {
            whisperProcessService.processAudio(interviewId, audioPath);
            System.out.println("✅ Whisper transcription triggered for interview: " + interviewId);
        } catch (Exception e) {
            System.out.println("❌ Failed to trigger Whisper for interview " + interviewId + ": " + e.getMessage());
        }

        return StudentInterviewMapper.toDto(interview);
    }




}
