package com.mockInterview.serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.StudentUGDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentUGDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentUGDetailsDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.StudentUGDetailsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentUGDetailsServiceImpl implements StudentUGDetailsService {

    private final StudentUGDetailsRepository ugDetailsRepository;
    private final UserRepository userRepository;

    // ================= GET =================

    @Override
    public StudentUGDetailsDto getByUserId(Long userId) {

        User loggedInUser = getCurrentUser();

        // STUDENT → only own data
        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && !loggedInUser.getUserId().equals(userId)) {
            throw new SecurityException("Students can view only their own UG details");
        }

        StudentUGDetails details =
                ugDetailsRepository.findByUser_UserId(userId);

        if (details == null) {
            throw new ResourceNotFoundException("Student UG details not found");
        }

        return mapToDto(details);
    }

    // ================= UPDATE =================

    @Override
    public StudentUGDetailsDto updateDetails(StudentUGDetails dto) {

        User loggedInUser = getCurrentUser();
        Long targetUserId = dto.getUser().getUserId();

        validateUpdatePermission(loggedInUser, targetUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentUGDetails details =
                ugDetailsRepository.findByUser_UserId(targetUserId);

        if (details == null) {
            details = new StudentUGDetails();
            details.setUser(targetUser);
        }

        // ---------- UPDATE FIELDS ----------
        details.setUniversityRollNo(dto.getUniversityRollNo());
        details.setCollegeName(dto.getCollegeName());
        details.setCourseName(dto.getCourseName());
        details.setBranch(dto.getBranch());
        details.setYearOfPassout(dto.getYearOfPassout());
        details.setMarksPercentage(dto.getMarksPercentage());
        details.setCgpa(dto.getCgpa());
        details.setActiveBacklogs(dto.getActiveBacklogs());

        details = ugDetailsRepository.save(details);

        return mapToDto(details);
    }

    // ================= SECURITY =================

    private User getCurrentUser() {

        Long currentUserId = SecurityUtils.getCurrentUserId();

        if (currentUserId == null) {
            throw new SecurityException("Unauthenticated access");
        }

        return userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Logged-in user not found"));
    }

    private void validateUpdatePermission(User loggedInUser, Long targetUserId) {

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(targetUser.getRole().getName())) {
            throw new SecurityException("UG details can be updated only for STUDENT users");
        }

        // MASTER_ADMIN → full access
        if (SecurityUtils.isMasterAdmin()) {
            return;
        }

        // OTHER ROLES → permission required
        if (!SecurityUtils.hasAuthority("UPDATE_STUDENT")) {
            throw new SecurityException("You do not have permission to update student details");
        }
    }

    // ================= MAPPER =================

    private StudentUGDetailsDto mapToDto(StudentUGDetails entity) {

        StudentUGDetailsDto dto = new StudentUGDetailsDto();

        dto.setUserId(entity.getUser().getUserId());
        dto.setUniversityRollNo(entity.getUniversityRollNo());
        dto.setCollegeName(entity.getCollegeName());
        dto.setCourseName(entity.getCourseName());
        dto.setBranch(entity.getBranch());
        dto.setYearOfPassout(entity.getYearOfPassout());
        dto.setMarksPercentage(entity.getMarksPercentage());
        dto.setCgpa(entity.getCgpa());
        dto.setActiveBacklogs(entity.getActiveBacklogs());

        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setUpdatedBy(entity.getUpdatedBy() != null ? String.valueOf(entity.getUpdatedBy()) : null);


        return dto;
    }
}
