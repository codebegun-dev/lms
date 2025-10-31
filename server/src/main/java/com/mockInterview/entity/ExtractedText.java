package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "extracted_texts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExtractedText {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    @OneToOne
    @JoinColumn(name = "interview_id", nullable = false)
    private StudentInterview interview;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String transcript;

    private LocalDateTime extractedAt = LocalDateTime.now();
}
