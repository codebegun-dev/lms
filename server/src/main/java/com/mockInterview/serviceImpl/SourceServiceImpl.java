package com.mockInterview.serviceImpl;

import java.util.List;
import java.util.Optional;

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

        return sourceRepository.save(source);
    }

    @Override
    public Source updateSource(Long id, Source source) {

        Optional<Source> optionalSource = sourceRepository.findById(id);

        if (!optionalSource.isPresent()) {
            throw new ResourceNotFoundException("Source not found with ID: " + id);
        }

        Source existing = optionalSource.get();
        existing.setSourceName(source.getSourceName());

        return sourceRepository.save(existing);
    }

    @Override
    public String deleteSource(Long id) {

        Optional<Source> optionalSource = sourceRepository.findById(id);

        if (!optionalSource.isPresent()) {
            throw new ResourceNotFoundException("Source not found with ID: " + id);
        }

        sourceRepository.delete(optionalSource.get());
        return "Source deleted successfully";
    }

    @Override
    public Source getSourceById(Long id) {

        Optional<Source> optionalSource = sourceRepository.findById(id);

        if (!optionalSource.isPresent()) {
            throw new ResourceNotFoundException("Source not found with ID: " + id);
        }

        return optionalSource.get();
    }

    @Override
    public List<Source> getAllSources() {
        return sourceRepository.findAll();
    }
}
