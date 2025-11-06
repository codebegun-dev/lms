package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id")
    private StudentInterview interview;

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "asked_order")
    private Integer askedOrder;

    // New field to mark whether this question was already served/asked
    @Builder.Default
    @Column(name = "answered", nullable = false)
    private Boolean answered = false;
}
