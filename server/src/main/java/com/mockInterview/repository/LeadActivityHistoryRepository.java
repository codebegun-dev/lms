package com.mockInterview.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.LeadActivityHistory;

@Repository
public interface LeadActivityHistoryRepository extends JpaRepository<LeadActivityHistory, Long> {

	
	List<LeadActivityHistory> findByLead_LeadIdOrderByCreatedAtDesc(Long leadId);
	
	Optional<LeadActivityHistory> findTopByLead_LeadIdOrderByCreatedAtDesc(Long leadId);
	
	@Query("SELECT h FROM LeadActivityHistory h JOIN FETCH h.lead WHERE h.reminderTime IS NOT NULL AND h.reminderTime <= :now AND h.isNotified = false")
	List<LeadActivityHistory> findDueReminders(@Param("now") LocalDateTime now);


}
