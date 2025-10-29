package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "question_bank")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category; // Technical, Communication, Behavioral

    @NotBlank(message = "Difficulty is required")
    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title can be max 500 characters")
    @Column(nullable = false, length = 500)
    private String title;

    @NotBlank(message = "Topic is required")
    @Column(nullable = false)
    private String topic; // Java, HTML, CSS, etc.

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDate createdDate; // Only date
}
