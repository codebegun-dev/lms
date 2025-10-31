package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "student_interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentInterview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to the student (User entity)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewRound round;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long durationSeconds;

    @Column(name = "audio_path")
    private String audioPath;

    @Column(name = "video_path")
    private String videoPath;

    
}
