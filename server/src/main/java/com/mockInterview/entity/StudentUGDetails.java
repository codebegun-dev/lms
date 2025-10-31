package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "student_ug_details")
public class StudentUGDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String universityRollNo;

    private String collegeName;

    private String courseName;

    private String branch;

    @Min(value = 1950, message = "Year cannot be before 1950")
    @Max(value = 2030, message = "Year cannot be after 2030")
    private Integer yearOfPassout;

    @DecimalMin(value = "0.0", message = "Marks must be >= 0")
    @DecimalMax(value = "100.0", message = "Marks must be <= 100")
    private Double marksPercentage;

    @DecimalMin(value = "0.0", message = "CGPA must be >= 0")
    @DecimalMax(value = "10.0", message = "CGPA must be <= 10")
    private Double cgpa;

    private Integer activeBacklogs;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    @NotNull(message = "User is required")
    private User user;
}
