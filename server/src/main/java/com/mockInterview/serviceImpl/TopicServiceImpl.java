package com.mockInterview.serviceImpl;


import com.mockInterview.entity.Category;
import com.mockInterview.entity.Topic;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.CategoryRepository;
import com.mockInterview.repository.TopicRepository;
import com.mockInterview.responseDtos.TopicDto;
import com.mockInterview.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopicServiceImpl implements TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // ✅ Add Topic
    @Override
    public TopicDto addTopic(TopicDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Topic topic = new Topic();
        topic.setName(dto.getName());
        topic.setCategory(category);

        Topic savedTopic = topicRepository.save(topic);
        return convertToDto(savedTopic);
    }

    // ✅ Update Topic
    @Override
    public TopicDto updateTopic(Long id, TopicDto dto) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));

        if (dto.getName() != null) {
            topic.setName(dto.getName());
        }

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            topic.setCategory(category);
        }

        Topic updatedTopic = topicRepository.save(topic);
        return convertToDto(updatedTopic);
    }

    // ✅ Get Topic by ID
    @Override
    public TopicDto getTopicById(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));
        return convertToDto(topic);
    }

    // ✅ Get All Topics
    @Override
    public List<TopicDto> getAllTopics() {
        List<Topic> topics = topicRepository.findAll();
        List<TopicDto> dtoList = new ArrayList<>();

        for (Topic topic : topics) {
            dtoList.add(convertToDto(topic));
        }
        return dtoList;
    }

    // ✅ Get Topics by Category ID
    @Override
    public List<TopicDto> getTopicsByCategoryId(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        List<Topic> topics = topicRepository.findByCategory(category);
        List<TopicDto> dtoList = new ArrayList<>();

        for (Topic topic : topics) {
            dtoList.add(convertToDto(topic));
        }
        return dtoList;
    }

    // ✅ Delete Topic
    @Override
    public void deleteTopic(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));
        topicRepository.delete(topic);
    }

    // ✅ Helper: Convert Entity → DTO
    private TopicDto convertToDto(Topic topic) {
        TopicDto dto = new TopicDto();
        dto.setId(topic.getId());
        dto.setName(topic.getName());

        if (topic.getCategory() != null) {
            dto.setCategoryId(topic.getCategory().getId());
            dto.setCategoryName(topic.getCategory().getName());
        }

        return dto;
    }
}
