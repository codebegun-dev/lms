package com.mockInterview.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;  // Quiz title

    private String description;  // Optional description

    private String difficulty;   // e.g., Easy, Medium, Hard

    private String duration;     // e.g., "10m", "30m"

    @Column(nullable = false)
    private Integer marks;       // Total marks for the quiz

    @Column(nullable = false)
    private Boolean negativeMarking = false; // Whether negative marking is enabled

    @Column(nullable = false)
    private String questionType; // single, multiple, manual, coding

    @Lob
    @Column(name = "questions_json", columnDefinition = "LONGTEXT", nullable = false)
    private String questionsJson;   // Store all questions as JSON array

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
