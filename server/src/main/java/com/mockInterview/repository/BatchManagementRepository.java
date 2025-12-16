package com.mockInterview.repository;

import com.mockInterview.entity.BatchManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BatchManagementRepository extends JpaRepository<BatchManagement, Long> {

    // Find by status
    List<BatchManagement> findByStatus(String status);

    // Upcoming batches (PENDING and startDate >= today)
    List<BatchManagement> findByStatusAndStartDateGreaterThanEqual(String status, LocalDate startDate);

    // Active batches (ACTIVE and startDate <= today and endDate >= today)
    List<BatchManagement> findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            String status, LocalDate startDate, LocalDate endDate);

    // Completed batches (COMPLETED and endDate <= today)
    List<BatchManagement> findByStatusAndEndDateLessThanEqual(String status, LocalDate endDate);

    // Optional helper to find batch by name if needed
    Optional<BatchManagement> findByName(String name);
    
       boolean existsByName(String name);
       
       List<BatchManagement> findAllByOrderByEnableDesc();
       
    // Fetch all active (enabled) batches ordered by name
       List<BatchManagement> findByEnableTrueOrderByNameAsc();




}
