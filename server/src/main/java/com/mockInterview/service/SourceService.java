package com.mockInterview.service;

import java.util.List;

import com.mockInterview.entity.Source;
import com.mockInterview.entity.Status;


public interface SourceService {

    Source createSource(Source source);

    Source updateSource(Long id, Source source);

    
    Source updateSourceStatus(Long id, Status status);

    
    List<Source> getActiveSources();

    String deleteSource(Long id);

    Source getSourceById(Long id);

    
    List<Source> getAllSources();
}
