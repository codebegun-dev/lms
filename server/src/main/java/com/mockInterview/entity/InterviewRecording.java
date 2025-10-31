package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_recordings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRecording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private StudentInterview interview;

    @Column(name = "user_id")
    private Long userId; // to identify user table record

    private String videoAudioFilePath;
    private String audioFilePath;
    private String textFilePath;

    private LocalDateTime uploadedAt;
}
