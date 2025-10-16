package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="interview_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId; // FK to users.userId (store id only, enforce in app)

    @Enumerated(EnumType.STRING)
    private InterviewType round;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Column(nullable=false)
    private String status; // IN_PROGRESS, COMPLETED, CANCELLED

    private String recordingUrl; // S3 or filesystem path

    private Integer score; // optional: later for analytics

    @Column(length=1000)
    private String notes;
}
