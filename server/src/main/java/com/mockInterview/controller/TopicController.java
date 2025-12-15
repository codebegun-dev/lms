package com.mockInterview.controller;

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

    // ✅ Create Topic
    @PreAuthorize("hasAuthority('CREATE_TOPIC')")
    @PostMapping
    public TopicDto addTopic(@Valid @RequestBody TopicDto dto) {
        return topicService.addTopic(dto);
    }

    // ✅ Get All Topics
    @PreAuthorize("hasAuthority('VIEW_TOPIC')")
    @GetMapping
    public List<TopicDto> getAllTopics() {
        return topicService.getAllTopics();
    }

    // ✅ Get Topics by Category
    @PreAuthorize("hasAuthority('VIEW_TOPIC')")
    @GetMapping("/category/{categoryId}")
    public List<TopicDto> getTopicsByCategory(@PathVariable Long categoryId) {
        return topicService.getTopicsByCategoryId(categoryId);
    }

    // ✅ Update Topic
    @PreAuthorize("hasAuthority('UPDATE_TOPIC')")
    @PutMapping("/{id}")
    public TopicDto updateTopic(@PathVariable Long id, @Valid @RequestBody TopicDto dto) {
        return topicService.updateTopic(id, dto);
    }

    // ✅ Delete Topic
    @PreAuthorize("hasAuthority('DELETE_TOPIC')")
    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
    }
}
