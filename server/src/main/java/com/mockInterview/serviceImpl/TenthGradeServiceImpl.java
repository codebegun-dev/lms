package com.mockInterview.serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.TenthGrade;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.TenthGradeRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.TenthGradeDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.TenthGradeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TenthGradeServiceImpl implements TenthGradeService {

    private final TenthGradeRepository tenthGradeRepository;
    private final UserRepository userRepository;

    // ================= GET =================

    @Override
    public TenthGradeDto getTenthGradeDetails(Long userId) {

        User loggedInUser = getCurrentUser();

        // STUDENT → only own data
        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && !loggedInUser.getUserId().equals(userId)) {
            throw new SecurityException("Students can view only their own tenth grade details");
        }

        TenthGrade details =
                tenthGradeRepository.findByUser_UserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Student tenth grade details not found"));

        return mapToDto(details);
    }

    // ================= UPDATE =================

    @Override
    public TenthGradeDto updateTenthGradeDetails(TenthGrade dto) {

        User loggedInUser = getCurrentUser();
        Long targetUserId = dto.getUser().getUserId();

        validateUpdatePermission(loggedInUser, targetUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TenthGrade details =
                tenthGradeRepository.findByUser_UserId(targetUserId)
                        .orElse(null);

        if (details == null) {
            details = new TenthGrade();
            details.setUser(targetUser);
        }

        // ---------- UPDATE FIELDS ----------
        details.setBoard(dto.getBoard());
        details.setSchoolName(dto.getSchoolName());
        details.setYearOfPassout(dto.getYearOfPassout());
        details.setMarksPercentage(dto.getMarksPercentage());

        details = tenthGradeRepository.save(details);

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
            throw new SecurityException("Tenth grade details can be updated only for STUDENT users");
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

    private TenthGradeDto mapToDto(TenthGrade entity) {

        TenthGradeDto dto = new TenthGradeDto();

       
        dto.setUserId(entity.getUser().getUserId());
        dto.setBoard(entity.getBoard());
        dto.setSchoolName(entity.getSchoolName());
        dto.setYearOfPassout(entity.getYearOfPassout());
        dto.setMarksPercentage(entity.getMarksPercentage());

        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setUpdatedBy(
                entity.getUpdatedBy() != null
                        ? String.valueOf(entity.getUpdatedBy())
                        : null
        );

        return dto;
    }
}
