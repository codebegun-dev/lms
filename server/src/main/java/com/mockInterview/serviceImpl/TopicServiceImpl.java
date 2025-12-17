package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Category;
import com.mockInterview.entity.Status;
import com.mockInterview.entity.Topic;

import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.InactiveResourceException;
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

    // ================= ADD =================
    @Override
    public TopicDto addTopic(TopicDto dto) {

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: " + dto.getCategoryId()));

        // ❌ Prevent topic creation under INACTIVE category
        if (category.getStatus() == Status.INACTIVE) {
            throw new InactiveResourceException(
                    "Cannot add topic to an inactive category");
        }

        if (topicRepository.existsByNameAndCategory(dto.getName(), category)) {
            throw new DuplicateFieldException(
                    "Topic name already exists in this category");
        }

        Topic topic = new Topic();
        topic.setName(dto.getName());
        topic.setCategory(category);
        topic.setStatus(Status.ACTIVE);

        return convertToDto(topicRepository.save(topic));
    }

 // ================= UPDATE =================
    @Override
    public TopicDto updateTopic(Long id, TopicDto dto) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Topic not found with id: " + id));

        // ❌ Inactive topic cannot be updated
        if (topic.getStatus() == Status.INACTIVE) {
            throw new InactiveResourceException(
                    "Inactive topic cannot be updated");
        }

        Category category = topic.getCategory();

        // ✅ Handle category change
        if (dto.getCategoryId() != null &&
                !dto.getCategoryId().equals(category.getId())) {

            Category newCategory = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Category not found with id: " + dto.getCategoryId()));

            // ❌ Prevent assigning topic to inactive category
            if (newCategory.getStatus() == Status.INACTIVE) {
                throw new InactiveResourceException(
                        "Cannot move topic to an inactive category");
            }

            category = newCategory;
        }

        // ✅ Duplicate name check within same category
        if (dto.getName() != null &&
                topicRepository.existsByNameAndCategoryAndIdNot(
                        dto.getName(), category, id)) {

            throw new DuplicateFieldException(
                    "Topic name already exists in this category");
        }

        // ✅ Update name if provided
        if (dto.getName() != null) {
            topic.setName(dto.getName());
        }

        topic.setCategory(category);

        return convertToDto(topicRepository.save(topic));
    }

    // ================= STATUS UPDATE =================
    @Override
    public TopicDto updateTopicStatus(Long id, Status status) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Topic not found with id: " + id));

        topic.setStatus(status);
        return convertToDto(topicRepository.save(topic));
    }

    // ================= GET BY ID =================
    @Override
    public TopicDto getTopicById(Long id) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Topic not found with id: " + id));

        return convertToDto(topic);
    }

    // ================= GET ALL (ACTIVE FIRST) =================
    @Override
    public List<TopicDto> getAllTopics() {

        List<Topic> active = topicRepository.findByStatus(Status.ACTIVE);
        List<Topic> inactive = topicRepository.findByStatus(Status.INACTIVE);

        List<TopicDto> result = new ArrayList<>();

        for (Topic t : active) {
            result.add(convertToDto(t));
        }
        for (Topic t : inactive) {
            result.add(convertToDto(t));
        }

        return result;
    }

    // ================= GET ACTIVE ONLY =================
    @Override
    public List<TopicDto> getActiveTopics() {

        List<Topic> topics = topicRepository.findByStatus(Status.ACTIVE);
        List<TopicDto> dtoList = new ArrayList<>();

        for (Topic topic : topics) {
            dtoList.add(convertToDto(topic));
        }
        return dtoList;
    }

    // ================= GET BY CATEGORY =================
    @Override
    public List<TopicDto> getTopicsByCategoryId(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id: " + categoryId));

        List<Topic> topics = topicRepository.findByCategory(category);
        List<TopicDto> dtoList = new ArrayList<>();

        for (Topic topic : topics) {
            dtoList.add(convertToDto(topic));
        }
        return dtoList;
    }

    // ================= DELETE =================
    @Override
    public void deleteTopic(Long id) {

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Topic not found with id: " + id));

        topicRepository.delete(topic);
    }

    // ================= DTO MAPPER =================
    private TopicDto convertToDto(Topic topic) {

        TopicDto dto = new TopicDto();
        dto.setId(topic.getId());
        dto.setName(topic.getName());
        dto.setCategoryId(topic.getCategory().getId());
        dto.setStatus(topic.getStatus());   

        return dto;
    }

}
