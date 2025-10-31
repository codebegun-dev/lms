package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to student interview
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private StudentInterview interview;

   
    private String transcriptPath; // file location for the transcript

    
    private String transcriptText; 

    private Integer communicationScore;
    private Integer confidenceScore;

    @Column(name = "category_round_type_score")
    private Integer categoryRoundTypeScore;

    private String overallRating;

    @Lob
    @Column(name = "improved_suggestions", columnDefinition = "LONGTEXT")
    private String improvedSuggestions;

    @Lob
    @Column(name = "ai_feedback", columnDefinition = "LONGTEXT")
    private String aiFeedback;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
