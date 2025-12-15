//package com.mockInterview.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.time.LocalDate;
//
//@Entity
//@Table(name = "question_bank")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class QuestionBank {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "category_id", nullable = false)
//    private Category category;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "topic_id", nullable = false)
//    private Topic topic;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "subtopic_id", nullable = true) 
//    private SubTopic subTopic;
//
//
//    @Column(nullable = false)
//    private String difficulty; 
//
//    @Column(nullable = false, length = 500)
//    private String title;
//  
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "created_by(user_id)", nullable = false)
//    private User createdBy;
//
//    @Column(nullable = false, updatable = false)
//    private LocalDate createdDate;
//}


package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "question_bank")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class QuestionBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subtopic_id", nullable = true) 
    private SubTopic subTopic;

    @Column(nullable = false)
    private String difficulty; 

    @Column(nullable = false, length = 500)
    private String title;

    // 🔹 Auditing fields
    @CreatedBy
    @Column(updatable = false)
    private Long createdBy;

    @LastModifiedBy
    private Long updatedBy;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDateTime;

    @LastModifiedDate
    private LocalDateTime updatedDateTime;
}
