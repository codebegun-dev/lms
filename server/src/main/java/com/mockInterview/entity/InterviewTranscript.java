package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_transcripts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewTranscript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Real FK mapping to StudentInterview
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false) // foreign key column
    private StudentInterview interview;

    @Column(nullable = false)
    private String transcriptFilePath;
}
