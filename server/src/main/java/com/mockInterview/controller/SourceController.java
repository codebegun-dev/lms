package com.mockInterview.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.entity.Source;
import com.mockInterview.service.SourceService;

import java.util.List;

@RestController
@RequestMapping("/api/sources")
@CrossOrigin (origins = "*")
public class SourceController {

    @Autowired
    private SourceService sourceService;

    // CREATE
    @PostMapping
    public Source createSource(@RequestBody Source source) {
        return sourceService.createSource(source);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Source updateSource(@PathVariable Long id, @RequestBody Source source) {
        return sourceService.updateSource(id, source);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteSource(@PathVariable Long id) {
        return sourceService.deleteSource(id);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Source getSourceById(@PathVariable Long id) {
        return sourceService.getSourceById(id);
    }

    // GET ALL
    @GetMapping
    public List<Source> getAllSources() {
        return sourceService.getAllSources();
    }
}
