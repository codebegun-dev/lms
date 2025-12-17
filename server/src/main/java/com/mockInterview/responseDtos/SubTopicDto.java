package com.mockInterview.responseDtos;

import com.mockInterview.entity.Status;
import lombok.Data;

@Data
public class SubTopicDto {
    private Long id;
    private String name;
    private Long topicId;
    private Status status;   
}