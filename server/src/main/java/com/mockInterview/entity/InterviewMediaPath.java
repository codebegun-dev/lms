package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_media_paths")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewMediaPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-generated primary key

    @OneToOne
    @JoinColumn(name = "interview_id", nullable = false)
    private StudentInterview interview;

    @Column(name = "video_path", nullable = true)
    private String videoPath;

    @Column(name = "audio_path", nullable = true)
    private String audioPath;
}
