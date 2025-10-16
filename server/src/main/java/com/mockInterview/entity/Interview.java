package com.mockInterview.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Interview {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private Long studentId; // reference to User.userId

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private InterviewType interviewType;

	    @Column(nullable = false)
	    private String status; // SCHEDULED, COMPLETED, ONGOING

	    private LocalDateTime scheduledTime;
	    private LocalDateTime startedAt;
	    private LocalDateTime endedAt;

	    @Column(length = 255)
	    private String recordedVideoUrl; // camera video or placeholder

	    @Column(length = 1000)
	    private String description; // remarks or notes
	}


