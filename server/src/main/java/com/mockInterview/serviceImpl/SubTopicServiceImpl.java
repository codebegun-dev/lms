package com.mockInterview.serviceImpl;


import com.mockInterview.entity.SubTopic;
import com.mockInterview.entity.Topic;
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

    @Override
    public SubTopicDto addSubTopic(SubTopicDto dto) {
        SubTopic subTopic = new SubTopic();
        subTopic.setName(dto.getName());

        // ✅ If topicId provided, link topic; else keep it null
        if (dto.getTopicId() != null) {
            Topic topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));
            subTopic.setTopic(topic);
        } else {
            subTopic.setTopic(null);
        }

        SubTopic savedSubTopic = subTopicRepository.save(subTopic);
        return convertToDto(savedSubTopic);
    }

    @Override
    public SubTopicDto updateSubTopic(Long id, SubTopicDto dto) {
        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + id));

        if (dto.getName() != null) {
            subTopic.setName(dto.getName());
        }

        // ✅ Optional topic update
        if (dto.getTopicId() != null) {
            Topic topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));
            subTopic.setTopic(topic);
        } else {
            subTopic.setTopic(null);
        }

        SubTopic updatedSubTopic = subTopicRepository.save(subTopic);
        return convertToDto(updatedSubTopic);
    }


    // ✅ Get SubTopic by ID
    @Override
    public SubTopicDto getSubTopicById(Long id) {
        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + id));
        return convertToDto(subTopic);
    }

    // ✅ Get All SubTopics
    @Override
    public List<SubTopicDto> getAllSubTopics() {
        List<SubTopic> subTopics = subTopicRepository.findAll();
        List<SubTopicDto> dtoList = new ArrayList<>();

        for (SubTopic s : subTopics) {
            dtoList.add(convertToDto(s));
        }
        return dtoList;
    }

    // ✅ Get SubTopics by Topic ID
    @Override
    public List<SubTopicDto> getSubTopicsByTopicId(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + topicId));

        List<SubTopic> subTopics = subTopicRepository.findByTopic(topic);
        List<SubTopicDto> dtoList = new ArrayList<>();

        for (SubTopic s : subTopics) {
            dtoList.add(convertToDto(s));
        }
        return dtoList;
    }

    // ✅ Delete SubTopic
    @Override
    public void deleteSubTopic(Long id) {
        SubTopic subTopic = subTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + id));
        subTopicRepository.delete(subTopic);
    }

    // ✅ Helper: Entity → DTO
    private SubTopicDto convertToDto(SubTopic subTopic) {
        SubTopicDto dto = new SubTopicDto();
        dto.setId(subTopic.getId());
        dto.setName(subTopic.getName());

        if (subTopic.getTopic() != null) {
            dto.setTopicId(subTopic.getTopic().getId());
            dto.setTopicName(subTopic.getTopic().getName());
        }

        return dto;
    }
}
