package com.mockInterview.mapper;

import com.mockInterview.entity.LeadActivityHistory;
import com.mockInterview.responseDtos.LeadActivityHistoryDto;

public class LeadActivityHistoryMapper {

    public static LeadActivityHistoryDto toDto(LeadActivityHistory entity) {
        LeadActivityHistoryDto dto = new LeadActivityHistoryDto();

        dto.setId(entity.getId());
        dto.setLeadId(entity.getLead() != null ? entity.getLead().getLeadId() : null);
        dto.setOldStatus(entity.getOldStatus());
        dto.setNewStatus(entity.getNewStatus());
        dto.setOldAssignedToId(entity.getOldAssignedToId());
        dto.setNewAssignedToId(entity.getNewAssignedToId());
        dto.setNotes(entity.getNotes());
        dto.setReminderTime(entity.getReminderTime());
        dto.setCreatedAt(entity.getCreatedAt());

        return dto;
    }
}
