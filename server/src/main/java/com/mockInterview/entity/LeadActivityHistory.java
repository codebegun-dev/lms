package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "lead_activity_history")
public class LeadActivityHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private SalesCourseManagement lead;

    @Column(name = "updated_by", nullable = false)
    private Long updatedBy;  

    @Column(name = "old_status")
    private String oldStatus;

    @Column(name = "new_status")
    private String newStatus;

    @Column(name = "old_assigned_to")
    private Long oldAssignedToId;

    @Column(name = "new_assigned_to")
    private Long newAssignedToId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "reminder_time")
    private LocalDateTime reminderTime;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "is_notified")
    private boolean isNotified = false;
    

@Column(name = "notified_at")
private LocalDateTime notifiedAt;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}


   

