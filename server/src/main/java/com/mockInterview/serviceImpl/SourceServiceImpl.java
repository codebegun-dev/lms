package com.mockInterview.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.Source;
import com.mockInterview.entity.Status;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.InactiveResourceException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.SourceRepository;
import com.mockInterview.service.SourceService;

@Service
public class SourceServiceImpl implements SourceService {

    @Autowired
    private SourceRepository sourceRepository;

    // ✅ Create Source
    @Override
    public Source createSource(Source source) {
        if (sourceRepository.existsBySourceName(source.getSourceName())) {
            throw new DuplicateFieldException("Source name already exists");
        }
        return sourceRepository.save(source); // status default ACTIVE via @PrePersist
    }

    // ✅ Update Source (only if ACTIVE)
    @Override
    public Source updateSource(Long id, Source source) {
        Source existing = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));

        // ❌ Cannot update INACTIVE source
        if (existing.getStatus() == Status.INACTIVE) {
            throw new InactiveResourceException("Inactive source cannot be updated");
        }

        // ❌ Duplicate name check (excluding same source)
        if (!existing.getSourceName().equalsIgnoreCase(source.getSourceName())
                && sourceRepository.existsBySourceName(source.getSourceName())) {
            throw new DuplicateFieldException("Source name already exists");
        }

        existing.setSourceName(source.getSourceName());
        return sourceRepository.save(existing);
    }

    // 🔹 Activate / Inactivate Source
    @Override
    public Source updateSourceStatus(Long id, Status status) {
        Source existing = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));

        existing.setStatus(status);
        return sourceRepository.save(existing);
    }

    // ✅ Delete Source
    @Override
    public String deleteSource(Long id) {
        Source existing = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));
        sourceRepository.delete(existing);
        return "Source deleted successfully";
    }

    // ✅ Get Source by ID
    @Override
    public Source getSourceById(Long id) {
        return sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));
    }

    // ✅ Get All Sources (ACTIVE first, then INACTIVE)
    @Override
    public List<Source> getAllSources() {
        return sourceRepository.findAllByOrderByStatusAsc();
    }

    // ✅ Get Only ACTIVE Sources
    @Override
    public List<Source> getActiveSources() {
        return sourceRepository.findByStatus(Status.ACTIVE);
    }
}
