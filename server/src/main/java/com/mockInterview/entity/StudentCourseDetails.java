package com.mockInterview.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "student_course_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentCourseDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;
    
    private String batchName;

    private LocalDate courseStartDate;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
