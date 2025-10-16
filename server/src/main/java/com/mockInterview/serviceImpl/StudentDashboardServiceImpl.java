package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.mockInterview.entity.*;
import com.mockInterview.repository.InterviewRepository;
import com.mockInterview.requestDtos.InterviewRequestDto;
import com.mockInterview.responseDtos.InterviewResponseDto;
import com.mockInterview.responseDtos.InterviewTrackingResponse;
import com.mockInterview.service.StudentDashboardService;

@Service
public class StudentDashboardServiceImpl implements StudentDashboardService {

    @Autowired
    private InterviewRepository interviewRepo;

    @Override
    public List<InterviewTrackingResponse> getFixedInterviewTracking() {
        List<InterviewTrackingResponse> list = new ArrayList<>();

        list.add(new InterviewTrackingResponse("Communication", "Focus on speaking, listening and confidence.", "comm_icon.png"));
        list.add(new InterviewTrackingResponse("Technical", "Covers Java, Spring Boot, SQL and logic.", "tech_icon.png"));
        list.add(new InterviewTrackingResponse("HR", "Tests your behavior, attitude and goals.", "hr_icon.png"));
        list.add(new InterviewTrackingResponse("Aptitude", "Basic math, reasoning, logic.", "apt_icon.png"));
        list.add(new InterviewTrackingResponse("Behavioral", "Personality and situation based.", "beh_icon.png"));

        return list;
    }

    @Override
    public InterviewResponseDto startInterview(InterviewRequestDto dto) {
        Interview interview = new Interview();
        interview.setStudentId(dto.getStudentId());
        interview.setInterviewType(dto.getInterviewType());
        interview.setStatus("ONGOING");
        interview.setStartedAt(LocalDateTime.now());
        interview.setDescription(dto.getDescription());
        interview.setRecordedVideoUrl("camera-session-" + System.currentTimeMillis() + ".mp4");

        interviewRepo.save(interview);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return new InterviewResponseDto(
                interview.getId(),
                interview.getInterviewType(),
                interview.getStatus(),
                null,
                interview.getStartedAt().format(fmt),
                null,
                interview.getDescription()
        );
    }

    @Override
    public InterviewResponseDto scheduleInterview(InterviewRequestDto dto) {
        Interview interview = new Interview();
        interview.setStudentId(dto.getStudentId());
        interview.setInterviewType(dto.getInterviewType());
        interview.setStatus("SCHEDULED");
        interview.setDescription(dto.getDescription());

        if (dto.getScheduledTime() != null && !dto.getScheduledTime().isEmpty()) {
            LocalDateTime time = LocalDateTime.parse(dto.getScheduledTime(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            interview.setScheduledTime(time);
        }

        interviewRepo.save(interview);

        return new InterviewResponseDto(
                interview.getId(),
                interview.getInterviewType(),
                interview.getStatus(),
                dto.getScheduledTime(),
                null,
                null,
                interview.getDescription()
        );
    }

    @Override
    public List<InterviewResponseDto> getAllInterviewsByStudent(Long studentId) {
        List<Interview> interviews = interviewRepo.findByStudentId(studentId);
        List<InterviewResponseDto> responses = new ArrayList<>();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        for (Interview interview : interviews) {
            String scheduled = interview.getScheduledTime() != null ? interview.getScheduledTime().format(fmt) : null;
            String started = interview.getStartedAt() != null ? interview.getStartedAt().format(fmt) : null;
            String ended = interview.getEndedAt() != null ? interview.getEndedAt().format(fmt) : null;

            InterviewResponseDto dto = new InterviewResponseDto(
                    interview.getId(),
                    interview.getInterviewType(),
                    interview.getStatus(),
                    scheduled,
                    started,
                    ended,
                    interview.getDescription()
            );
            responses.add(dto);
        }

        return responses;
    }
}
