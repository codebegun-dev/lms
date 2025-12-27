package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import com.mockInterview.entity.SalesCourseManagement;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.SalesCourseManagementMapper;
import com.mockInterview.repository.SalesCourseManagementRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.BulkLeadAssignRequestDto;
import com.mockInterview.requestDtos.BulkReassignLeadsRequestDto;
import com.mockInterview.responseDtos.AssignableUserDto;
import com.mockInterview.responseDtos.LeadsDashboardResponseDto;
import com.mockInterview.responseDtos.SalesCourseManagementResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.AutoAssignLeadService;

@Service
@Transactional
public class AutoAssignLeadServiceImpl implements AutoAssignLeadService {
	
	

    @Autowired
    private SalesCourseManagementRepository leadRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public void autoAssignLeads() {

        // 1️⃣ Eligible users
        List<User> users =
                userRepo.findUsersByPermission("AUTO_ASSIGN_LEADS");

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users with AUTO_ASSIGN_LEADS permission");
        }

        // 2️⃣ NEW & unassigned leads
        List<SalesCourseManagement> leads =
                leadRepo.findNewUnassignedLeads();

        if (leads.isEmpty()) return;

        int userCount = users.size();
        int totalLeads = leads.size();

        int equalShare = totalLeads / userCount;
        int remaining = totalLeads % userCount;

        int leadIndex = 0;

        // ================= PHASE 1: ROUND ROBIN =================
        for (User user : users) {
            for (int i = 0; i < equalShare && leadIndex < totalLeads; i++) {
                SalesCourseManagement lead = leads.get(leadIndex++);
                lead.setAssignedTo(user);
                lead.setAssignedAt(LocalDateTime.now());
            }
        }

        // ================= PHASE 2: STATUS-BASED =================
        while (remaining > 0 && leadIndex < totalLeads) {

            User selectedUser = null;
            long minNewCount = Long.MAX_VALUE;

            for (User user : users) {
                long newCount =
                        leadRepo.countNewLeadsByUser(user.getUserId());

                if (newCount < minNewCount) {
                    minNewCount = newCount;
                    selectedUser = user;
                }
            }

            SalesCourseManagement lead = leads.get(leadIndex++);
            lead.setAssignedTo(selectedUser);
            lead.setAssignedAt(LocalDateTime.now());

            remaining--;
        }

        // 3️⃣ Save all
        leadRepo.saveAll(leads);  
    }
    
    
    

    @Override
    public LeadsDashboardResponseDto getUserDashboard(int page, int pageSize) {

        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new ResourceNotFoundException("User not logged in");
        }

        Pageable pageable = PageRequest.of(page, pageSize);

        Page<SalesCourseManagement> leadPage =
                leadRepo.findLeadsByUserIdPaginated(userId, pageable);

        List<Object[]> rawStatusData =
                leadRepo.countLeadsByStatusForUser(userId);

        Long totalLeads =
                leadRepo.countLeadsForUser(userId);

        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] row : rawStatusData) {
            statusCounts.put((String) row[0], (Long) row[1]);
        }

        List<SalesCourseManagementResponseDto> dtoList = new ArrayList<>();
        for (SalesCourseManagement lead : leadPage.getContent()) {
            dtoList.add(SalesCourseManagementMapper.toResponseDto(lead));
        }

        LeadsDashboardResponseDto response = new LeadsDashboardResponseDto();
        response.setTotalLeads(totalLeads);
        response.setStatusCounts(statusCounts);
        response.setLeadsList(dtoList);
        response.setCurrentPage(page);
        response.setPageSize(pageSize);
        response.setTotalPages(leadPage.getTotalPages());

        // assignedUsersCount intentionally NOT set

        return response;
    }


    @Override
    @Transactional
    public void bulkReassignLeads(BulkReassignLeadsRequestDto dto) {

        // 1️⃣ Validate FROM user
        User fromUser = userRepo.findById(dto.getFromUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "From user not found with ID: " + dto.getFromUserId()
                ));

        // 2️⃣ Validate TO user
        User toUser = userRepo.findById(dto.getToUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "To user not found with ID: " + dto.getToUserId()
                ));

        if (fromUser.getUserId().equals(toUser.getUserId())) {
            throw new IllegalArgumentException("From and To users cannot be the same");
        }

        // 3️⃣ Fetch leads assigned to FROM user
        List<SalesCourseManagement> leads =
                leadRepo.findByAssignedUserId(fromUser.getUserId());

        if (leads.isEmpty()) {
            throw new ResourceNotFoundException("No leads found for the selected user");
        }

        // 4️⃣ Reassign leads
        LocalDateTime now = LocalDateTime.now();
        for (SalesCourseManagement lead : leads) {
            lead.setAssignedTo(toUser);
            lead.setAssignedAt(now);
        }

        // 5️⃣ Save bulk
        leadRepo.saveAll(leads);
    }
    
    
    
    @Override
    @Transactional
    public void assignLeadsToUser(BulkLeadAssignRequestDto dto) {

        // 1️⃣ Validate user
        User assignedUser = userRepo.findById(dto.getAssignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with ID: " + dto.getAssignedUserId()
                ));

        // 2️⃣ Fetch leads
        List<SalesCourseManagement> leads =
                leadRepo.findByLeadIds(dto.getLeadIds());

        if (leads.isEmpty()) {
            throw new ResourceNotFoundException("No leads found for given lead IDs");
        }

        // 3️⃣ Assign leads
        LocalDateTime now = LocalDateTime.now();
        for (SalesCourseManagement lead : leads) {
            lead.setAssignedTo(assignedUser);
            lead.setAssignedAt(now);
        }

        // 4️⃣ Save
        leadRepo.saveAll(leads);
    }
    
    
    @Override
    public List<AssignableUserDto> getAllAutoAssignUsers() {
        List<User> users = userRepo.findUsersByPermission("AUTO_ASSIGN_LEADS");

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found with AUTO_ASSIGN_LEADS permission");
        }

        List<AssignableUserDto> dtos = new ArrayList<>();
        for (User user : users) {
            String fullName = user.getFirstName() + " " + user.getLastName();
            String roleName = (user.getRole() != null) ? user.getRole().getName() : null;
            dtos.add(new AssignableUserDto(user.getUserId(), fullName, user.getEmail(), roleName));
        }
        return dtos;
    }



    

}
