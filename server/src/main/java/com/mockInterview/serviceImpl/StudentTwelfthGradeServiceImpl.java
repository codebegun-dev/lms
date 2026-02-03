package com.mockInterview.serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.StudentTwelfthGrade;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentTwelfthGradeRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentTwelfthGradeDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.StudentTwelfthGradeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentTwelfthGradeServiceImpl implements StudentTwelfthGradeService {

    private final StudentTwelfthGradeRepository twelfthGradeRepository;
    private final UserRepository userRepository;

    // ================= GET =================

    @Override
    public StudentTwelfthGradeDto getTwelfthGradeDetails(Long userId) {

        User loggedInUser = getCurrentUser();

        // STUDENT → only own data
        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && !loggedInUser.getUserId().equals(userId)) {
            throw new SecurityException("Students can view only their own twelfth grade details");
        }

        StudentTwelfthGrade details =
                twelfthGradeRepository.findByUser_UserId(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Student twelfth grade details not found"));


        if (details == null) {
            throw new ResourceNotFoundException("Student twelfth grade details not found");
        }

        return mapToDto(details);
    }

    // ================= UPDATE =================

    @Override
    public StudentTwelfthGradeDto updateTwelfthGradeDetails(StudentTwelfthGrade dto) {

        User loggedInUser = getCurrentUser();
        Long targetUserId = dto.getUser().getUserId();

        validateUpdatePermission(loggedInUser, targetUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        StudentTwelfthGrade details =
                twelfthGradeRepository.findByUser_UserId(targetUserId)
                        .orElse(null);

        if (details == null) {
            details = new StudentTwelfthGrade();
            details.setUser(targetUser);
        }


        // ---------- UPDATE FIELDS ----------
        details.setBoard(dto.getBoard());
        details.setGroupName(dto.getGroupName());
        details.setCollegeName(dto.getCollegeName());
        details.setYearOfPassout(dto.getYearOfPassout());
        details.setMarksPercentage(dto.getMarksPercentage());

        details = twelfthGradeRepository.save(details);

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
            throw new SecurityException("Twelfth grade details can be updated only for STUDENT users");
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

    private StudentTwelfthGradeDto mapToDto(StudentTwelfthGrade entity) {

        StudentTwelfthGradeDto dto = new StudentTwelfthGradeDto();

        dto.setUserId(entity.getUser().getUserId());
        dto.setBoard(entity.getBoard());
        dto.setGroupName(entity.getGroupName());
        dto.setCollegeName(entity.getCollegeName());
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
