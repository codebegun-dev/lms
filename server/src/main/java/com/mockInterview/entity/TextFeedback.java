package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "text_feedback")
public class TextFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private StudentInterview interview;

    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    
    private int communicationScore;
    private int confidenceScore;
    private int categoryRoundTypeScore;
    private double overallRating;

    @Column(columnDefinition = "TEXT")
    private String improvementSuggestions;

    private String createdAt;
}
