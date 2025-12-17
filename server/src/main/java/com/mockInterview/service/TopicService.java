package com.mockInterview.service;

import java.util.List;

import com.mockInterview.entity.Status;
import com.mockInterview.responseDtos.TopicDto;

public interface TopicService {

    TopicDto addTopic(TopicDto dto);

    TopicDto updateTopic(Long id, TopicDto dto);

    
    TopicDto updateTopicStatus(Long id, Status status);

    TopicDto getTopicById(Long id);

    List<TopicDto> getAllTopics();

    
    List<TopicDto> getActiveTopics();

    List<TopicDto> getTopicsByCategoryId(Long categoryId);

    void deleteTopic(Long id);
}
