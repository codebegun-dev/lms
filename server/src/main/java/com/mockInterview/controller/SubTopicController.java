package com.mockInterview.controller;

import com.mockInterview.responseDtos.SubTopicDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.SubTopicService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtopics")
@ModulePermission("SUBTOPIC_MANAGEMENT")
@CrossOrigin(origins = "*")
public class SubTopicController {

    @Autowired
    private SubTopicService subTopicService;

    // ✅ Create SubTopic
    @PreAuthorize("hasAuthority('CREATE_SUBTOPIC')")
    @PostMapping
    public SubTopicDto addSubTopic(@Valid @RequestBody SubTopicDto dto) {
        return subTopicService.addSubTopic(dto);
    }

    // ✅ Get All SubTopics
    @PreAuthorize("hasAuthority('VIEW_SUBTOPIC')")
    @GetMapping
    public List<SubTopicDto> getAllSubTopics() {
        return subTopicService.getAllSubTopics();
    }

    // ✅ Get SubTopics by Topic
    @PreAuthorize("hasAuthority('VIEW_SUBTOPIC')")
    @GetMapping("/topic/{topicId}")
    public List<SubTopicDto> getSubTopicsByTopicId(@PathVariable Long topicId) {
        return subTopicService.getSubTopicsByTopicId(topicId);
    }

    // ✅ Update SubTopic
    @PreAuthorize("hasAuthority('UPDATE_SUBTOPIC')")
    @PutMapping("/{id}")
    public SubTopicDto updateSubTopic(@PathVariable Long id, @Valid @RequestBody SubTopicDto dto) {
        return subTopicService.updateSubTopic(id, dto);
    }

    // ✅ Delete SubTopic
    @PreAuthorize("hasAuthority('DELETE_SUBTOPIC')")
    @DeleteMapping("/{id}")
    public void deleteSubTopic(@PathVariable Long id) {
        subTopicService.deleteSubTopic(id);
    }
}
