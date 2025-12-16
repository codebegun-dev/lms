package com.mockInterview.service;

import com.mockInterview.responseDtos.BatchManagementDto;

import java.util.List;

public interface BatchManagementService {

    // ✅ Create a new batch
    BatchManagementDto createBatch(BatchManagementDto batchDto);

    // ✅ Get batch by ID
    BatchManagementDto getBatchById(Long batchId);

    // ✅ Get all batches
    List<BatchManagementDto> getAllBatches();

    // ✅ Update batch by ID
    BatchManagementDto updateBatch(Long batchId, BatchManagementDto batchDto);

    

    // ✅ Get batches by status (PENDING, ACTIVE, COMPLETED)
    List<BatchManagementDto> getBatchesByStatus(String status);

    // ✅ Optional: Get upcoming batches (startDate > today)
    List<BatchManagementDto> getUpcomingBatches();

    // ✅ Optional: Get active batches (startDate <= today and completedDate null or in future)
    List<BatchManagementDto> getActiveBatches();

    // ✅ Optional: Get completed batches (completedDate <= today)
    List<BatchManagementDto> getCompletedBatches();
    
 // ✅ Enable / Disable batch (soft delete)
    BatchManagementDto changeBatchEnableStatus(Long batchId, boolean enable);

}
