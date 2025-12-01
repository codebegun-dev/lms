package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.LeadActivityHistory;
import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.entity.User;
import com.mockInterview.repository.LeadActivityHistoryRepository;
import com.mockInterview.service.LeadActivityHistoryService;

import jakarta.transaction.Transactional;
@Transactional
@Service
public class LeadActivityHistoryServiceImpl implements LeadActivityHistoryService {

    @Autowired
    private LeadActivityHistoryRepository historyRepo;

    @Override
    public void saveHistory(
            SalesCourseManagement lead,
            String oldStatus,
            String newStatus,
            User oldAssignedTo,
            User newAssignedTo,
            String notes,
            LocalDateTime reminderTime,
            Long updatedBy
    ) {
        LeadActivityHistory history = new LeadActivityHistory();
        history.setLead(lead);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setNotes(notes);
        history.setReminderTime(reminderTime);
        history.setUpdatedBy(updatedBy);

        // Convert Users to IDs
        Long oldId = oldAssignedTo != null ? oldAssignedTo.getUserId() : null;
        Long newId = newAssignedTo != null ? newAssignedTo.getUserId() : null;

        // Save IDs into DB
        history.setOldAssignedToId(oldId);
        history.setNewAssignedToId(newId);

        // Append assignment change ONLY if values actually changed
        boolean assignmentChanged =
                (oldId == null && newId != null) ||
                (oldId != null && !oldId.equals(newId));

        if (assignmentChanged) {
            String assignChange = "Assigned changed from "
                    + (oldId != null ? oldId : "null")
                    + " to "
                    + (newId != null ? newId : "null");

            history.setNotes((notes != null ? notes + " | " : "") + assignChange);
        }

        historyRepo.save(history);
    }

   


}
