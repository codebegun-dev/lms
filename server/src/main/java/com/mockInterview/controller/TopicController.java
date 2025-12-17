package com.mockInterview.controller;


import com.mockInterview.entity.Status;
import com.mockInterview.responseDtos.TopicDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.TopicService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@ModulePermission("TOPIC_MANAGEMENT")
@CrossOrigin(origins = "*")
public class TopicController {

    @Autowired
    private TopicService topicService;

    // ✅ CREATE
    @PreAuthorize("hasAuthority('CREATE_TOPIC')")
    @PostMapping
    public TopicDto addTopic(@Valid @RequestBody TopicDto dto) {
        return topicService.addTopic(dto);
    }

    // ✅ GET ALL (ACTIVE → INACTIVE)
    @PreAuthorize("hasAuthority('VIEW_TOPIC')")
    @GetMapping
    public List<TopicDto> getAllTopics() {
        return topicService.getAllTopics();
    }

    // ✅ GET ONLY ACTIVE TOPICS
    @PreAuthorize("hasAuthority('VIEW_TOPIC')")
    @GetMapping("/active")
    public List<TopicDto> getActiveTopics() {
        return topicService.getActiveTopics();
    }

    // ✅ GET BY ID
    @PreAuthorize("hasAuthority('VIEW_TOPIC')")
    @GetMapping("/{id}")
    public TopicDto getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id);
    }

    // ✅ GET TOPICS BY CATEGORY
    @PreAuthorize("hasAuthority('VIEW_TOPIC')")
    @GetMapping("/category/{categoryId}")
    public List<TopicDto> getTopicsByCategory(@PathVariable Long categoryId) {
        return topicService.getTopicsByCategoryId(categoryId);
    }

    // ✅ UPDATE (only ACTIVE allowed – enforced in service)
    @PreAuthorize("hasAuthority('UPDATE_TOPIC')")
    @PutMapping("/{id}")
    public TopicDto updateTopic(
            @PathVariable Long id,
            @Valid @RequestBody TopicDto dto) {

        return topicService.updateTopic(id, dto);
    }

    // ✅ ACTIVATE / INACTIVATE
    @PreAuthorize("hasAuthority('UPDATE_STATUS_TOPIC')")
    @PutMapping("/{id}/status")
    public TopicDto updateTopicStatus(
            @PathVariable Long id,
            @RequestParam Status status) {

        return topicService.updateTopicStatus(id, status);
    }

 // ✅ DELETE
    @PreAuthorize("hasAuthority('DELETE_TOPIC')")
    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
    }
}
