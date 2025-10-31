package com.mockInterview.controller;


import com.mockInterview.responseDtos.TopicDto;
import com.mockInterview.service.TopicService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "*")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @PostMapping
    public TopicDto addTopic( @Valid @RequestBody TopicDto dto) {
        return topicService.addTopic(dto);
    }

    @GetMapping
    public List<TopicDto> getAllTopics() {
        return topicService.getAllTopics();
    }
    
    @GetMapping("/category/{categoryId}")
    public List<TopicDto> getTopicsByCategory(@PathVariable Long categoryId) {
        return topicService.getTopicsByCategoryId(categoryId);
    }


    @PutMapping("/{id}")
    public TopicDto updateTopic(@PathVariable Long id, @Valid @RequestBody TopicDto dto) {
        return topicService.updateTopic(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
    }
}
