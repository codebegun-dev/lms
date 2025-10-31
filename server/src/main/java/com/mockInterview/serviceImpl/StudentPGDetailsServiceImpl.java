package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentPGDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentPGDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentPGDetailsDto;
import com.mockInterview.service.StudentPGDetailsService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentPGDetailsServiceImpl implements StudentPGDetailsService {

    @Autowired
    private StudentPGDetailsRepository pgRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public StudentPGDetailsDto getByUserId(Long userId) {
    	Optional<User> userOpt = userRepository.findById(userId);
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + userId);
    	}
    	User user = userOpt.get();

        StudentPGDetails pgDetails = pgRepository.findByUser_UserId(userId);

        if (pgDetails == null) {
            pgDetails = new StudentPGDetails();
            pgDetails.setUser(user);
        }

        return mapToDto(pgDetails);
    }

    @Override
    public StudentPGDetailsDto updateDetails(StudentPGDetailsDto dto) {
    	Optional<User> userOpt = userRepository.findById(dto.getUserId());
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
    	}
    	User user = userOpt.get();

        StudentPGDetails pgDetails = pgRepository.findByUser_UserId(dto.getUserId());
        if (pgDetails == null) {
            pgDetails = new StudentPGDetails();
            pgDetails.setUser(user);
        }

        pgDetails.setHasPG(dto.isHasPG());
        pgDetails.setHasBacklogs(dto.isHasBacklogs());
        pgDetails.setCollegeName(dto.getCollegeName());
        pgDetails.setCourseName(dto.getCourseName());
        pgDetails.setBranch(dto.getBranch());
        pgDetails.setMarksPercentage(dto.getMarksPercentage());
        pgDetails.setCgpa(dto.getCgpa());
        pgDetails.setYearOfPassout(dto.getYearOfPassout());
        pgDetails.setActiveBacklogs(dto.getActiveBacklogs());

        pgRepository.save(pgDetails);

        return mapToDto(pgDetails);
    }

    private StudentPGDetailsDto mapToDto(StudentPGDetails pgDetails) {
        StudentPGDetailsDto dto = new StudentPGDetailsDto();
        dto.setUserId(pgDetails.getUser().getUserId());
        dto.setHasPG(pgDetails.isHasPG());
        dto.setHasBacklogs(pgDetails.isHasBacklogs());
        dto.setCollegeName(pgDetails.getCollegeName());
        dto.setCourseName(pgDetails.getCourseName());
        dto.setBranch(pgDetails.getBranch());
        dto.setMarksPercentage(pgDetails.getMarksPercentage());
        dto.setCgpa(pgDetails.getCgpa());
        dto.setYearOfPassout(pgDetails.getYearOfPassout());
        dto.setActiveBacklogs(pgDetails.getActiveBacklogs());
        return dto;
    }
}
