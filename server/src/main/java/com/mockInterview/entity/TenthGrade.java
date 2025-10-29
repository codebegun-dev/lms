package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "student_tenth_grade")
public class TenthGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Board is required")
    private String board;

    @NotBlank(message = "School name is required")
    private String schoolName;

    @NotBlank(message = "Year of passout is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "Year of passout must be 4 digits")
    private String yearOfPassout;

    @NotBlank(message = "Marks percentage is required")
    private String marksPercentage;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = false)
    private User user;
}
