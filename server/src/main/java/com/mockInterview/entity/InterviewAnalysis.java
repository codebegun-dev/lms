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

    // Fixed scores
    @Builder.Default
    private Integer communicationScore = 5;

    @Builder.Default
    private Integer confidenceScore = 5;

    @Builder.Default
    @Column(name = "category_round_type_score")
    private Integer categoryRoundTypeScore = 5;

    @Column
    private String overallRating;

    @Lob
    @Column(name = "improved_suggestions", columnDefinition = "LONGTEXT")
    private String improvedSuggestions;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // ✅ Calculate overallRating based on scores
    public void calculateOverallRating() {
        double average = (communicationScore + confidenceScore + categoryRoundTypeScore) / 3.0;

        if (average >= 4.5) {
            overallRating = "Excellent";
        } else if (average >= 3.5) {
            overallRating = "Good";
        } else if (average >= 2.5) {
            overallRating = "Average";
        } else {
            overallRating = "Poor";
        }
    }
}
