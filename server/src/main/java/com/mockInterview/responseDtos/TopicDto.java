package com.mockInterview.responseDtos;

import lombok.Data;

@Data
public class TopicDto {
    private Long id;
    private String name;
    private Long categoryId;
    private String categoryName;
}
