package com.mockInterview.controller;


import com.mockInterview.responseDtos.SubTopicDto;
import com.mockInterview.service.SubTopicService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subtopics")
@CrossOrigin(origins = "*")
public class SubTopicController {

    @Autowired
    private SubTopicService subTopicService;

    @PostMapping
    public SubTopicDto addSubTopic(@Valid @RequestBody SubTopicDto dto) {
        return subTopicService.addSubTopic(dto);
    }

    @GetMapping
    public List<SubTopicDto> getAllSubTopics() {
        return subTopicService.getAllSubTopics();
    }

    @GetMapping("/topic/{topicId}")
    public List<SubTopicDto> getSubTopicsByTopicId(@PathVariable Long topicId) {
        return subTopicService.getSubTopicsByTopicId(topicId);
    }

    @PutMapping("/{id}")
    public SubTopicDto updateSubTopic(@PathVariable Long id, @Valid @RequestBody SubTopicDto dto) {
        return subTopicService.updateSubTopic(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteSubTopic(@PathVariable Long id) {
        subTopicService.deleteSubTopic(id);
    }
}
