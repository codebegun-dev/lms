package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;



@Entity
@Table(name = "sources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sourceId;

    @Column(nullable = false, unique = true)
    private String sourceName;

    // 🔹 STATUS FIELD
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // ================= AUDIT FIELDS =================
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

    // 🔹 DEFAULT STATUS = ACTIVE
    @PrePersist
    public void setDefaultStatus() {
        if (this.status == null) {
            this.status = Status.ACTIVE;
        }
    }
}
