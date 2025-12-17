package com.mockInterview.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mockInterview.entity.Source;
import com.mockInterview.entity.Status;

public interface SourceRepository extends JpaRepository<Source, Long> {

	boolean existsBySourceName(String sourceName);

	List<Source> findByStatus(Status status);

	List<Source> findAllByOrderByStatusAsc();

}
