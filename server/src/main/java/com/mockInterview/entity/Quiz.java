package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quizzes")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer timeLimit; // minutes

    @Column(nullable = false)
    private Integer totalMarks;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subtopic_id")
    private SubTopic subTopic;

    
    @Column(nullable = false)
    private String quizType; // PUBLIC / PRIVATE

    private Boolean showResults;

    
    private Boolean enableTabSwitchRestriction;

    private Integer maxTabSwitchAttempts;

    private Boolean enableCamera;

    private Boolean enableRecording;

    
    @ElementCollection
    @CollectionTable(
        name = "quiz_restricted_emails",
        joinColumns = @JoinColumn(name = "quiz_id")
    )
    @Column(name = "email")
    private List<String> restrictedEmails;

    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private Long createdBy;

    @LastModifiedBy
    private Long updatedBy;
}
