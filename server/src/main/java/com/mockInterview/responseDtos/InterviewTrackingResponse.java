package com.mockInterview.responseDtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewTrackingResponse {
    private String interviewName;
    private String description;
    private String iconUrl; // optional
}