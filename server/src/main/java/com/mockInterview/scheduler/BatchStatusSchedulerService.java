package com.mockInterview.scheduler;

import com.mockInterview.entity.BatchManagement;
import com.mockInterview.repository.BatchManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BatchStatusSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(BatchStatusSchedulerService.class);

    @Autowired
    private BatchManagementRepository batchRepo;

//    @Scheduled(cron = "0 * * * * *") // every minute
   @Scheduled(cron = "0 0 0 * * *")

    public void scheduleBatches() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<BatchManagement> batchesToUpdate = new ArrayList<>();

        // Fetch only batches that might need a status update
        List<BatchManagement> pendingBatches = batchRepo.findByStatus("PENDING");
        List<BatchManagement> activeBatches = batchRepo.findByStatus("ACTIVE");

        List<BatchManagement> candidates = new ArrayList<>();
        candidates.addAll(pendingBatches);
        candidates.addAll(activeBatches);

        for (BatchManagement batch : candidates) {
            String oldStatus = batch.getStatus();
            String newStatus = oldStatus;

            LocalTime startTime = batch.getStartTime() != null ? batch.getStartTime() : LocalTime.MIDNIGHT;
            LocalTime endTime = batch.getEndTime() != null ? batch.getEndTime() : LocalTime.MAX;

            // COMPLETED: endDate before today OR today but endTime passed
            if (batch.getEndDate().isBefore(today) || (batch.getEndDate().isEqual(today) && endTime.isBefore(now))) {
                newStatus = "COMPLETED";
            } 
            // ACTIVE: started (startDate before today OR today and startTime passed) AND not ended
            else if ((batch.getStartDate().isBefore(today) || (batch.getStartDate().isEqual(today) && startTime.isBefore(now)))
                     && (batch.getEndDate().isAfter(today) || (batch.getEndDate().isEqual(today) && endTime.isAfter(now)))) {
                newStatus = "ACTIVE";
            } 
            // PENDING: not started yet
            else {
                newStatus = "PENDING";
            }

            if (!oldStatus.equals(newStatus)) {
                batch.setStatus(newStatus);
                batchesToUpdate.add(batch);
                logger.info("Batch '{}' status changed from '{}' to '{}'", batch.getName(), oldStatus, newStatus);
            }
        }

        if (!batchesToUpdate.isEmpty()) {
            batchRepo.saveAll(batchesToUpdate);
            logger.info("{} batch(es) updated in this cycle.", batchesToUpdate.size());
        }
    }
}
