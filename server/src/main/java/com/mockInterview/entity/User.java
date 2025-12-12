package com.mockInterview.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotNull
    @Size(min = 3, max = 30)
    private String firstName;

    @NotNull
    @Size(min = 3, max = 30)
    private String lastName;

    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")
    private String email;

    @NotNull
    @Pattern(regexp = "^[0-9]{10}$")
    private String phone;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "role_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_user_role"))
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Role role;

    private String resetToken;

    @Column(nullable = false)
    private String status = "ACTIVE";

    // =================== Auditing Fields ===================
    @CreatedBy
    private Long createdBy;

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedBy
    private Long updatedBy;

    @LastModifiedDate
    private LocalDateTime updatedDate;

    public String getName() {
        return firstName + " " + lastName;
    }
}
