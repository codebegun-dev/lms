package com.mockInterview.responseDtos;

import com.mockInterview.entity.Status;
import lombok.Data;

@Data
public class TopicDto {

    private Long id;
    private String name;

    private Long categoryId;

    private Status status;   
}
