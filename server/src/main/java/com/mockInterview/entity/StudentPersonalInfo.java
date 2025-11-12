package com.mockInterview.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "student_personal_info")
public class StudentPersonalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "Male|Female|Other", message = "Gender must be Male, Female, or Other")
    private String gender;

    @NotNull(message = "Date of Birth is required")
    @Past(message = "Date of Birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Parent mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Parent mobile number must be 10 digits")
    private String parentMobileNumber;

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "A\\+|A\\-|B\\+|B\\-|O\\+|O\\-|AB\\+|AB\\-", message = "Invalid blood group")
    private String bloodGroup;

    private String profilePicturePath; // relative path for frontend

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    @NotNull(message = "User is required")
    private User user;
}
