package com.mockInterview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mockInterview.entity.Source;

public interface SourceRepository extends JpaRepository<Source, Long> {

    boolean existsBySourceName(String sourceName);
}
