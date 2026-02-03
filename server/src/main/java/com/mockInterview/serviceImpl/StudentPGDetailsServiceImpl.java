package com.mockInterview.serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.StudentPGDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentPGDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentPGDetailsDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.StudentPGDetailsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentPGDetailsServiceImpl implements StudentPGDetailsService {

    private final StudentPGDetailsRepository pgDetailsRepository;
    private final UserRepository userRepository;

    @Override
    public StudentPGDetailsDto getByUserId(Long userId) {
        User loggedInUser = getCurrentUser();

        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && !loggedInUser.getUserId().equals(userId)) {
            throw new SecurityException("Students can view only their own details");
        }

        StudentPGDetails details = pgDetailsRepository.findByUser_UserId(userId);
        if (details == null) {
            throw new ResourceNotFoundException("Student PG details not found");
        }

        return mapToDto(details);  // ✅ convert entity to DTO
    }


    @Override
    public StudentPGDetailsDto updateDetails(StudentPGDetails dto) {

        User loggedInUser = getCurrentUser();
        Long targetUserId = dto.getUser().getUserId();

        validateUpdatePermission(loggedInUser, targetUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentPGDetails details = pgDetailsRepository.findByUser_UserId(targetUserId);
        if (details == null) {
            details = new StudentPGDetails();
            details.setUser(targetUser);
        }

        // ---------- UPDATE FIELDS ----------
        details.setHasPG(dto.getHasPG());
       
        details.setCollegeName(dto.getCollegeName());
        details.setCourseName(dto.getCourseName());
        details.setBranch(dto.getBranch());
        details.setMarksPercentage(dto.getMarksPercentage());
        details.setCgpa(dto.getCgpa());
        details.setYearOfPassout(dto.getYearOfPassout());
        details.setActiveBacklogs(dto.getActiveBacklogs());

        details = pgDetailsRepository.save(details);

        return mapToDto(details);  // ✅ return DTO
    }


    // ================= SECURITY =================

    private User getCurrentUser() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new SecurityException("Unauthenticated access");
        }

        return userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    private void validateUpdatePermission(User loggedInUser, Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(targetUser.getRole().getName())) {
            throw new SecurityException("PG details can only be updated for STUDENT users");
        }

        // MASTER_ADMIN → full access
        if (SecurityUtils.isMasterAdmin()) return;

        // OTHER ROLES → permission required
        if (!SecurityUtils.hasAuthority("UPDATE_STUDENT")) {
            throw new SecurityException("You do not have permission to update student details");
        }
    }
    
    private StudentPGDetailsDto mapToDto(StudentPGDetails entity) {
        if (entity == null) return null;

        StudentPGDetailsDto dto = new StudentPGDetailsDto();
        dto.setUserId(entity.getUser().getUserId());
        dto.setHasPG(entity.getHasPG());
        
        dto.setCollegeName(entity.getCollegeName());
        dto.setCourseName(entity.getCourseName());
        dto.setBranch(entity.getBranch());
        dto.setMarksPercentage(entity.getMarksPercentage());
        dto.setCgpa(entity.getCgpa());
        dto.setYearOfPassout(entity.getYearOfPassout());
        dto.setActiveBacklogs(entity.getActiveBacklogs());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setUpdatedBy(entity.getUpdatedBy() != null ? String.valueOf(entity.getUpdatedBy()) : null);


        return dto;
    }

}
