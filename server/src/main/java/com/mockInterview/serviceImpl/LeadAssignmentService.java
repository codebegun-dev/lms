package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.exception.UnauthorizedActionException;
import com.mockInterview.repository.SalesCourseManagementRepository;
import com.mockInterview.repository.UserRepository;

@Service
public class LeadAssignmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SalesCourseManagementRepository salesCourseManagementRepository;

    // ---------------- VALIDATE LOGGED-IN USER ROLE ----------------
    public void validateUserRole(Long loggedInUserId) {
        if (loggedInUserId == null) {
            throw new UnauthorizedActionException("Logged-in user ID is required");
        }

        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

        String roleName = loggedInUser.getRole() != null ? loggedInUser.getRole().getName() : null;

        if (roleName == null ||
                (!roleName.startsWith("SA_") &&
                        !"MASTER_ADMIN".equalsIgnoreCase(roleName) &&
                        !"SALES_MANAGER".equalsIgnoreCase(roleName))) {
            throw new UnauthorizedActionException(
                    "User (" + loggedInUser.getFirstName() + ") is not authorized to perform this action"
            );
        }
    }

    // ---------------- FIND BEST COUNSELLOR FOR AUTO-ASSIGN ----------------
    public User findBestCounsellorForAutoAssign() {

        List<User> counsellors = userRepository
                .findByRole_NameStartingWithAndStatus("SA_", "ACTIVE");

        if (counsellors.isEmpty()) return null;

        List<Object[]> counts = salesCourseManagementRepository.getNewLeadCounts();

        Map<Long, Long> loadMap = new HashMap<>();
        for (Object[] row : counts) {
            Long userId = (Long) row[0];
            Long cnt = (Long) row[1];
            loadMap.put(userId, cnt);
        }

        User best = null;
        long min = Long.MAX_VALUE;

        for (User u : counsellors) {
            long load = loadMap.getOrDefault(u.getUserId(), 0L);
            if (u.getRole().getName().startsWith("SA_") && load < min) {
                min = load;
                best = u;
            }
        }

        return best;
    }

    // ---------------- AUTO-ASSIGN LEAD BASED ON STATUS ----------------
    public void autoAssignOnStatusChange(SalesCourseManagement lead, Long loggedInUserId) {

        if (!"NEW".equalsIgnoreCase(lead.getStatus())) return;

        User bestUser = findBestCounsellorForAutoAssign();
        if (bestUser == null) return;

        if (!bestUser.getRole().getName().startsWith("SA_")) return;

        lead.setAssignedTo(bestUser);

        if (loggedInUserId != null) {
            User loggedInUser = userRepository.findById(loggedInUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
            lead.setAssignedBy(loggedInUser);
        }

        lead.setAssignedAt(LocalDateTime.now());

        salesCourseManagementRepository.save(lead);
    }

    // ---------------- BULK ASSIGN LEADS TO USER ----------------
    public void bulkAssignLeads(List<SalesCourseManagement> leads, User assignedUser, User loggedInUser) {

        if (leads == null || leads.isEmpty() || assignedUser == null || loggedInUser == null) return;

        for (SalesCourseManagement lead : leads) {
            lead.setAssignedTo(assignedUser);
            lead.setAssignedBy(loggedInUser);
            lead.setAssignedAt(LocalDateTime.now());
        }

        salesCourseManagementRepository.saveAll(leads);
    }

    // ---------------- REBALANCE NEW LEAD ASSIGNMENTS ----------------
    public void rebalanceAssignments(List<SalesCourseManagement> newLeads, List<User> counsellors, Long loggedInUserId) {

        if (newLeads.isEmpty() || counsellors.isEmpty()) return;

        // Sort counsellors by ID for stable distribution
        counsellors.sort((a, b) -> Long.compare(a.getUserId(), b.getUserId()));

        int cCount = counsellors.size();
        int index = 0;

        User loggedInUser = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));

        // Clear existing assignments
        for (SalesCourseManagement s : newLeads) {
            s.setAssignedTo(null);
        }

        // Round-robin assignment
        for (SalesCourseManagement s : newLeads) {
            User assignTo = counsellors.get(index);
            s.setAssignedTo(assignTo);
            s.setAssignedBy(loggedInUser);
            s.setAssignedAt(LocalDateTime.now());
            index = (index + 1) % cCount;
        }

        salesCourseManagementRepository.saveAll(newLeads);
    }

    // ---------------- GET ACTIVE COUNSELLORS ----------------
    public List<User> getActiveCounsellors() {
        return userRepository.findByRole_NameStartingWithAndStatus("SA_", "ACTIVE");
    }
}
