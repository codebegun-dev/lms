package com.mockInterview.service;

import java.util.List;

import com.mockInterview.entity.Status;
import com.mockInterview.responseDtos.SubTopicDto;

public interface SubTopicService {
    SubTopicDto addSubTopic(SubTopicDto dto);
    SubTopicDto updateSubTopic(Long id, SubTopicDto dto);
    SubTopicDto getSubTopicById(Long id);
    List<SubTopicDto> getAllSubTopics();
    List<SubTopicDto> getSubTopicsByTopicId(Long topicId);
    void deleteSubTopic(Long id);

    
    List<SubTopicDto> getActiveSubTopics();

    
    List<SubTopicDto> getAllSubTopicsWithStatus();
    SubTopicDto updateSubTopicStatus(Long id, Status status);
}
