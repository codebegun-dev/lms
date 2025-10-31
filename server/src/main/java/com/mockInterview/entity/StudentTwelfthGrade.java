package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "student_twelfth_grade")
public class StudentTwelfthGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Board name (CBSE, State Board, etc.)
    @NotBlank(message = "Board name is required")
    private String board;

    // ✅ Group (e.g., Science, Commerce, etc.)
    @NotBlank(message = "Group name is required")
    private String groupName;

    // ✅ College / School name
    @NotBlank(message = "College name is required")
    private String collegeName;

    // ✅ Year of passout (e.g., 2021)
    @NotNull(message = "Year of passout is required")
    @Min(value = 1950, message = "Year of passout must be after 1950")
    private Integer yearOfPassout;

    // ✅ Marks percentage
    @NotNull(message = "Marks percentage is required")
    @DecimalMin(value = "0.0", message = "Marks percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Marks percentage cannot exceed 100")
    private Double marksPercentage;

    // ✅ Relationship with User
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = false)
    private User user;
}
