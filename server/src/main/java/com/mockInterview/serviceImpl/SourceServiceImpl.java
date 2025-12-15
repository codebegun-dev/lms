package com.mockInterview.serviceImpl;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.Source;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.SourceRepository;
import com.mockInterview.service.SourceService;

@Service
public class SourceServiceImpl implements SourceService {

    @Autowired
    private SourceRepository sourceRepository;

    @Override
    public Source createSource(Source source) {
        if (sourceRepository.existsBySourceName(source.getSourceName())) {
            throw new DuplicateFieldException("Source name already exists");
        }
        return sourceRepository.save(source); // auditing will handle createdBy & createdDate
    }

    @Override
    public Source updateSource(Long id, Source source) {
        Source existing = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));

        if (sourceRepository.existsBySourceNameAndSourceIdNot(source.getSourceName(), id)) {
            throw new DuplicateFieldException("Source name already exists");
        }

        existing.setSourceName(source.getSourceName());
        return sourceRepository.save(existing); // auditing will handle updatedBy & updatedDate
    }

    @Override
    public String deleteSource(Long id) {
        Source existing = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));
        sourceRepository.delete(existing);
        return "Source deleted successfully";
    }

    @Override
    public Source getSourceById(Long id) {
        return sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));
    }

    @Override
    public List<Source> getAllSources() {
        return sourceRepository.findAll();
    }

}
