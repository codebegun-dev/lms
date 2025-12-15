package com.mockInterview.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.entity.Source;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.SourceService;

import java.util.List;

@RestController
@RequestMapping("/api/sources")
@ModulePermission("SOURCE_MANAGEMENT")
@CrossOrigin(origins = "*")
public class SourceController {

    @Autowired
    private SourceService sourceService;

    // CREATE
    @PreAuthorize("hasAuthority('CREATE_SOURCE')")
    @PostMapping
    public Source createSource(@RequestBody Source source) {
        return sourceService.createSource(source);
    }

    // UPDATE
    @PreAuthorize("hasAuthority('UPDATE_SOURCE')")
    @PutMapping("/{id}")
    public Source updateSource(@PathVariable Long id, @RequestBody Source source) {
        return sourceService.updateSource(id, source);
    }

    // DELETE
    @PreAuthorize("hasAuthority('DELETE_SOURCE')")
    @DeleteMapping("/{id}")
    public String deleteSource(@PathVariable Long id) {
        return sourceService.deleteSource(id);
    }

    // GET BY ID
    @PreAuthorize("hasAuthority('VIEW_SOURCE')")
    @GetMapping("/{id}")
    public Source getSourceById(@PathVariable Long id) {
        return sourceService.getSourceById(id);
    }

    // GET ALL
    @PreAuthorize("hasAuthority('VIEW_SOURCE')")
    @GetMapping
    public List<Source> getAllSources() {
        return sourceService.getAllSources();
    }
}
