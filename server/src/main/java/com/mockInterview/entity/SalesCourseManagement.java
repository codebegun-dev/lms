package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "sales_course_management")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SalesCourseManagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leadId;

    @Column(nullable = false, length = 30)
    private String leadName;

    @Column(nullable = false, length = 10)
    private String phone;

    private String email;
    private String gender;
    private String passedOutYear;
    private String qualification;

    // ===== COURSE =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")  
    private CourseManagement courseManagement;

    private String college;
    private String city;

    // ===== SOURCE & CAMPAIGN =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private Source source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    // ===== LEAD STATUS =====
    @Column(nullable = false)
    private String status = "NEW";

    // ===== ASSIGNMENT =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    private LocalDateTime assignedAt;

    // ===== AUDIT =====
    @CreatedBy
    @Column(updatable = false)
    private Long createdBy;

    @LastModifiedBy
    private Long updatedBy;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime updatedDate;
    
    
}
