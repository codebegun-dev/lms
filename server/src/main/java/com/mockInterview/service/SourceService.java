
package com.mockInterview.service;

import java.util.List;
import com.mockInterview.entity.Source;

public interface SourceService {

    Source createSource(Source source);

    Source updateSource(Long id, Source source);

    String deleteSource(Long id);

    Source getSourceById(Long id);

    List<Source> getAllSources();
}
