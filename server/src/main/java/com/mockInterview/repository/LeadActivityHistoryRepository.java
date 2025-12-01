package com.mockInterview.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.LeadActivityHistory;

@Repository
public interface LeadActivityHistoryRepository extends JpaRepository<LeadActivityHistory, Long> {

	
	List<LeadActivityHistory> findByLead_LeadIdOrderByCreatedAtDesc(Long leadId);
	
	Optional<LeadActivityHistory> findTopByLead_LeadIdOrderByCreatedAtDesc(Long leadId);

}
