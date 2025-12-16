package com.mockInterview.controller;

import com.mockInterview.responseDtos.BatchManagementDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.BatchManagementService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "*")
@ModulePermission("BATCH_MANAGEMENT")
public class BatchManagementController {

    @Autowired
    private BatchManagementService batchService;

    // ✅ Create a new batch
    @PreAuthorize("hasAuthority('CREATE_BATCH')")
    @PostMapping("/create")
    public BatchManagementDto createBatch(@RequestBody BatchManagementDto batchDto) {
        return batchService.createBatch(batchDto);
    }

    // ✅ Get batch by ID
    @PreAuthorize("hasAuthority('VIEW_BATCH')")
    @GetMapping("/{id}")
    public BatchManagementDto getBatchById(@PathVariable Long id) {
        return batchService.getBatchById(id);
    }

    // ✅ Get all batches
    @PreAuthorize("hasAuthority('VIEW_BATCH')")
    @GetMapping("/all")
    public List<BatchManagementDto> getAllBatches() {
        return batchService.getAllBatches();
    }
    
    @PreAuthorize("hasAuthority('VIEW_BATCH')")
    @GetMapping("/available")
    public List<BatchManagementDto> getAllAvailableBatches() {
        return batchService.getAllAvailableBatches();
    }


    // ✅ Update batch by ID
    @PreAuthorize("hasAuthority('UPDATE_BATCH')")
    @PutMapping("/update/{id}")
    public BatchManagementDto updateBatch(
            @PathVariable Long id,
            @RequestBody BatchManagementDto batchDto) {
        return batchService.updateBatch(id, batchDto);
    }

    

    // ✅ Get batches by status
    @PreAuthorize("hasAuthority('VIEW_BATCH')")
    @GetMapping("/status/{status}")
    public List<BatchManagementDto> getBatchesByStatus(@PathVariable String status) {
        return batchService.getBatchesByStatus(status);
    }

    // ✅ Get upcoming batches
    @PreAuthorize("hasAuthority('VIEW_BATCH')")
    @GetMapping("/upcoming")
    public List<BatchManagementDto> getUpcomingBatches() {
        return batchService.getUpcomingBatches();
    }

    // ✅ Get active batches
    @PreAuthorize("hasAuthority('VIEW_BATCH')")
    @GetMapping("/active")
    public List<BatchManagementDto> getActiveBatches() {
        return batchService.getActiveBatches();
    }

    // ✅ Get completed batches
    @PreAuthorize("hasAuthority('VIEW_BATCH')")
    @GetMapping("/completed")
    public List<BatchManagementDto> getCompletedBatches() {
        return batchService.getCompletedBatches();
    }
    
 // 🔹 Enable / Disable batch (Soft Delete)
    @PreAuthorize("hasAuthority('SOFT_DELETE_BATCH')")
    @PutMapping("/enable/{id}")
    public BatchManagementDto changeBatchEnableStatus(
            @PathVariable Long id,
            @RequestParam boolean enable) {

        return batchService.changeBatchEnableStatus(id, enable);
    }

}
