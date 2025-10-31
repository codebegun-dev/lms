package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class SubTopicDto {
    private Long id;
    private String name;
    private Long topicId;
    private String topicName;
}
