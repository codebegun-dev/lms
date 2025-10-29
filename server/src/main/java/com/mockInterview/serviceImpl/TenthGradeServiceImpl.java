package com.mockInterview.serviceImpl;

import com.mockInterview.entity.TenthGrade;
import com.mockInterview.entity.User;
import com.mockInterview.repository.TenthGradeRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.TenthGradeDto;
import com.mockInterview.service.TenthGradeService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TenthGradeServiceImpl implements TenthGradeService {

    @Autowired
    private TenthGradeRepository tenthGradeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public TenthGradeDto getTenthGradeDetails(Long userId) {
        TenthGrade tenth = tenthGradeRepository.findByUser_UserId(userId);
        if (tenth == null) {
            return null;
        }

        TenthGradeDto dto = new TenthGradeDto();
        dto.setId(tenth.getId());
        dto.setUserId(userId);
        dto.setBoard(tenth.getBoard());
        dto.setSchoolName(tenth.getSchoolName());
        dto.setYearOfPassout(tenth.getYearOfPassout());
        dto.setMarksPercentage(tenth.getMarksPercentage());
        return dto;
    }

    @Override
    public TenthGradeDto updateTenthGradeDetails(TenthGradeDto dto) {
        // Find user
        Optional<User> userOpt = userRepository.findById(dto.getUserId());
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with ID: " + dto.getUserId());
        }
        User user = userOpt.get();

        // Find TenthGrade details
        TenthGrade tenth = tenthGradeRepository.findByUser_UserId(dto.getUserId());

        // If not found, create new
        if (tenth == null) {
            tenth = new TenthGrade();
            tenth.setUser(user);
        }

        // Update fields
        tenth.setBoard(dto.getBoard());
        tenth.setSchoolName(dto.getSchoolName());
        tenth.setYearOfPassout(dto.getYearOfPassout());
        tenth.setMarksPercentage(dto.getMarksPercentage());

        // Save and return DTO
        tenth = tenthGradeRepository.save(tenth);
        dto.setId(tenth.getId());
        return dto;
    }

}
