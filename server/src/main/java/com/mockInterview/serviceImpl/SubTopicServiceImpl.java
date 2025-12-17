package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Status;
import com.mockInterview.entity.SubTopic;
import com.mockInterview.entity.Topic;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.InactiveResourceException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.SubTopicRepository;
import com.mockInterview.repository.TopicRepository;
import com.mockInterview.responseDtos.SubTopicDto;
import com.mockInterview.service.SubTopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubTopicServiceImpl implements SubTopicService {

    @Autowired
    private SubTopicRepository subTopicRepository;

    @Autowired
    private TopicRepository topicRepository;

    // ================= ADD =================
    @Override
    public SubTopicDto addSubTopic(SubTopicDto dto) {

        Topic topic = null;
        if (dto.getTopicId() != null) {
            topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));

            // ❌ Cannot add under inactive topic
            if (topic.getStatus() == Status.INACTIVE) {
                throw new InactiveResourceException("Cannot add SubTopic under inactive Topic");
            }

            // ❌ Duplicate name under same topic
            if (subTopicRepository.existsByNameAndTopic(dto.getName(), topic)) {
                throw new DuplicateFieldException("SubTopic name already exists in this topic");
            }
        }

        SubTopic subTopic = new SubTopic();
        subTopic.setName(dto.getName());
        subTopic.setTopic(topic);
        subTopic.setStatus(Status.ACTIVE);

        return convertToDto(subTopicRepository.save(subTopic));
    }

    // ================= UPDATE =================
    @Override
    public SubTopicDto updateSubTopic(Long id, SubTopicDto dto) {

        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + id));

        // ❌ Inactive subtopic cannot be updated
        if (subTopic.getStatus() == Status.INACTIVE) {
            throw new InactiveResourceException("Inactive SubTopic cannot be updated");
        }

        Topic topic = subTopic.getTopic();

        if (dto.getTopicId() != null && (topic == null || !dto.getTopicId().equals(topic.getId()))) {
            topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));

            // ❌ Cannot assign inactive topic
            if (topic.getStatus() == Status.INACTIVE) {
                throw new InactiveResourceException("Cannot assign SubTopic to inactive Topic");
            }
        }

        // ❌ Check duplicate name under topic
        if (dto.getName() != null &&
                subTopicRepository.existsByNameAndTopicAndIdNot(dto.getName(), topic, id)) {
            throw new DuplicateFieldException("SubTopic name already exists in this topic");
        }

        if (dto.getName() != null) subTopic.setName(dto.getName());
        subTopic.setTopic(topic);

        return convertToDto(subTopicRepository.save(subTopic));
    }

    // ================= GET BY ID =================
    @Override
    public SubTopicDto getSubTopicById(Long id) {
        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + id));
        return convertToDto(subTopic);
    }

    // ================= GET ALL (ACTIVE FIRST) =================
    @Override
    public List<SubTopicDto> getAllSubTopics() {
        List<SubTopic> active = subTopicRepository.findByStatus(Status.ACTIVE);
        List<SubTopic> inactive = subTopicRepository.findByStatus(Status.INACTIVE);

        List<SubTopicDto> result = new ArrayList<>();
        for (SubTopic s : active) result.add(convertToDto(s));
        for (SubTopic s : inactive) result.add(convertToDto(s));

        return result;
    }

    @Override
    public List<SubTopicDto> getActiveSubTopics() {
        List<SubTopic> subTopics = subTopicRepository.findByStatus(Status.ACTIVE);
        List<SubTopicDto> dtoList = new ArrayList<>();
        for (SubTopic s : subTopics) {
            dtoList.add(convertToDto(s));
        }
        return dtoList;
    }

    @Override
    public List<SubTopicDto> getAllSubTopicsWithStatus() {
        List<SubTopic> active = subTopicRepository.findByStatus(Status.ACTIVE);
        List<SubTopic> inactive = subTopicRepository.findByStatus(Status.INACTIVE);

        List<SubTopicDto> result = new ArrayList<>();
        for (SubTopic s : active) {
            result.add(convertToDto(s));
        }
        for (SubTopic s : inactive) {
            result.add(convertToDto(s));
        }
        return result;
    }


    // ================= GET BY TOPIC =================
    @Override
    public List<SubTopicDto> getSubTopicsByTopicId(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + topicId));

        List<SubTopic> subTopics = subTopicRepository.findByTopic(topic);
        List<SubTopicDto> dtoList = new ArrayList<>();
        for (SubTopic s : subTopics) dtoList.add(convertToDto(s));
        return dtoList;
    }

    // ================= DELETE =================
    @Override
    public void deleteSubTopic(Long id) {
        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + id));
        subTopicRepository.delete(subTopic);
    }
    
    
    
    @Override
    public SubTopicDto updateSubTopicStatus(Long id, Status status) {

        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + id));

        // Optional: Cannot activate under inactive topic
        if (subTopic.getTopic() != null && subTopic.getTopic().getStatus() == Status.INACTIVE) {
            throw new InactiveResourceException("Cannot change status of SubTopic under inactive Topic");
        }

        subTopic.setStatus(status);
        SubTopic updated = subTopicRepository.save(subTopic);
        return convertToDto(updated);
    }


    // ================= DTO MAPPER =================
    private SubTopicDto convertToDto(SubTopic subTopic) {
        SubTopicDto dto = new SubTopicDto();
        dto.setId(subTopic.getId());
        dto.setName(subTopic.getName());
        dto.setStatus(subTopic.getStatus());
        if (subTopic.getTopic() != null) dto.setTopicId(subTopic.getTopic().getId());
        return dto;
    }
}
