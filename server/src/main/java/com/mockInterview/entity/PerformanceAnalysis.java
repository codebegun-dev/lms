package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_analysis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "interview_id", nullable = false)
    private StudentInterview interview;

    // Round-specific scores (nullable if not relevant for this round)
    private Integer technicalScore;
    private Integer hrScore;
    private Integer behavioralScore;

    // Universal score
    private Integer communicationScore;

    private Integer confidenceScore;
    private Integer clarityScore;
    private Integer understandingScore;
    private String overallRating;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(columnDefinition = "TEXT")
    private String improvementSuggestions;

    private LocalDateTime analyzedAt = LocalDateTime.now();
}
