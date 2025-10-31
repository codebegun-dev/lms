package com.mockInterview.service;


import java.util.List;

import com.mockInterview.responseDtos.TopicDto;

public interface TopicService {
    TopicDto addTopic(TopicDto dto);
    TopicDto updateTopic(Long id, TopicDto dto);
    TopicDto getTopicById(Long id);
    List<TopicDto> getAllTopics();
    List<TopicDto> getTopicsByCategoryId(Long categoryId);
    void deleteTopic(Long id);
}
