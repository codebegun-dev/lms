package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentTwelfthGrade;
import com.mockInterview.entity.User;
import com.mockInterview.repository.StudentTwelfthGradeRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentTwelfthGradeDto;
import com.mockInterview.service.StudentTwelfthGradeService;
import com.mockInterview.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentTwelfthGradeServiceImpl implements StudentTwelfthGradeService {

    @Autowired
    private StudentTwelfthGradeRepository twelfthGradeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public StudentTwelfthGradeDto getTwelfthGradeDetails(Long userId) {
    	Optional<StudentTwelfthGrade> entityOpt = twelfthGradeRepository.findByUser_UserId(userId);
    	if (!entityOpt.isPresent()) {
    	    throw new ResourceNotFoundException("Twelfth Grade details not found for user ID: " + userId);
    	}
    	StudentTwelfthGrade entity = entityOpt.get();
    	return convertToDto(entity);

    }

    @Override
    public StudentTwelfthGradeDto updateTwelfthGradeDetails(StudentTwelfthGradeDto dto) {
        // ✅ Step 1: Find user
    	Optional<User> userOpt = userRepository.findById(dto.getUserId());
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
    	}
    	User user = userOpt.get();

        // ✅ Step 2: Find existing Twelfth Grade record (or create new)
        Optional<StudentTwelfthGrade> existing = twelfthGradeRepository.findByUser_UserId(dto.getUserId());
        StudentTwelfthGrade entity = existing.orElse(new StudentTwelfthGrade());
        entity.setUser(user);

        // ✅ Step 3: Update fields
        entity.setBoard(dto.getBoard());
        entity.setGroupName(dto.getGroupName());
        entity.setCollegeName(dto.getCollegeName());
        entity.setYearOfPassout(dto.getYearOfPassout());
        entity.setMarksPercentage(dto.getMarksPercentage());

        // ✅ Step 4: Save and return updated DTO
        StudentTwelfthGrade saved = twelfthGradeRepository.save(entity);
        return convertToDto(saved);
    }

    // ✅ Utility: Convert Entity → DTO
    private StudentTwelfthGradeDto convertToDto(StudentTwelfthGrade entity) {
        StudentTwelfthGradeDto dto = new StudentTwelfthGradeDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getUserId());
        dto.setBoard(entity.getBoard());
        dto.setGroupName(entity.getGroupName());
        dto.setCollegeName(entity.getCollegeName());
        dto.setYearOfPassout(entity.getYearOfPassout());
        dto.setMarksPercentage(entity.getMarksPercentage());
        return dto;
    }
}
