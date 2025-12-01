package com.mockInterview.controller;

import com.mockInterview.entity.LeadActivityHistory;
import com.mockInterview.mapper.LeadActivityHistoryMapper;
import com.mockInterview.repository.LeadActivityHistoryRepository;
import com.mockInterview.responseDtos.LeadActivityHistoryDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class LeadActivityHistoryController {

    @Autowired
    private LeadActivityHistoryRepository historyRepo;

    // ---------------- GET ALL HISTORY FOR A LEAD ----------------
    @GetMapping("/lead/{leadId}")
    public List<LeadActivityHistoryDto> getHistoryByLead(@PathVariable Long leadId) {
        List<LeadActivityHistory> historyList =
                historyRepo.findByLead_LeadIdOrderByCreatedAtDesc(leadId);

        return historyList.stream()
                .map(LeadActivityHistoryMapper::toDto)
                .toList();
    }


 // ---------------- GET LATEST (LAST) ACTIVITY ----------------
    @GetMapping("/lead/{leadId}/latest")
    public LeadActivityHistoryDto getLatestActivity(@PathVariable Long leadId) {

        LeadActivityHistory history = historyRepo
                .findTopByLead_LeadIdOrderByCreatedAtDesc(leadId)
                .orElse(null);

        if (history == null) return null;

        return LeadActivityHistoryMapper.toDto(history);
    }

}
