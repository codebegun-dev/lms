package com.mockInterview.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "campaigns")
@EntityListeners(AuditingEntityListener.class)
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaignId;

    @Column(nullable = false, unique = true)
    private String campaignName;

    // 🔹 COMMON STATUS FIELD
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // 🔹 AUDIT FIELDS
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

    // 🔹 DEFAULT STATUS
    @PrePersist
    public void setDefaultStatus() {
        if (this.status == null) {
            this.status = Status.ACTIVE;
        }
    }
}
