package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentUGDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentUGDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentUGDetailsDto;
import com.mockInterview.service.StudentUGDetailsService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentUGDetailsServiceImpl implements StudentUGDetailsService {

    @Autowired
    private StudentUGDetailsRepository ugRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public StudentUGDetailsDto getByUserId(Long userId) {
    	Optional<User> userOpt = userRepository.findById(userId);
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + userId);
    	}
    	User user = userOpt.get();

        StudentUGDetails ugDetails = ugRepository.findByUser_UserId(userId);

        if (ugDetails == null) {
            ugDetails = new StudentUGDetails();
            ugDetails.setUser(user);
        }

        return mapToDto(ugDetails);
    }

    @Override
    public StudentUGDetailsDto updateDetails(StudentUGDetailsDto dto) {
    	Optional<User> userOpt = userRepository.findById(dto.getUserId());
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
    	}
    	User user = userOpt.get();

        StudentUGDetails ugDetails = ugRepository.findByUser_UserId(dto.getUserId());
        if (ugDetails == null) {
            ugDetails = new StudentUGDetails();
            ugDetails.setUser(user);
        }

        ugDetails.setUniversityRollNo(dto.getUniversityRollNo());
        ugDetails.setCollegeName(dto.getCollegeName());
        ugDetails.setCourseName(dto.getCourseName());
        ugDetails.setBranch(dto.getBranch());
        ugDetails.setYearOfPassout(dto.getYearOfPassout());
        ugDetails.setMarksPercentage(dto.getMarksPercentage());
        ugDetails.setCgpa(dto.getCgpa());
        ugDetails.setActiveBacklogs(dto.getActiveBacklogs());

        ugRepository.save(ugDetails);

        return mapToDto(ugDetails);
    }

    private StudentUGDetailsDto mapToDto(StudentUGDetails ugDetails) {
        StudentUGDetailsDto dto = new StudentUGDetailsDto();
        dto.setUserId(ugDetails.getUser().getUserId());
        dto.setUniversityRollNo(ugDetails.getUniversityRollNo());
        dto.setCollegeName(ugDetails.getCollegeName());
        dto.setCourseName(ugDetails.getCourseName());
        dto.setBranch(ugDetails.getBranch());
        dto.setYearOfPassout(ugDetails.getYearOfPassout());
        dto.setMarksPercentage(ugDetails.getMarksPercentage());
        dto.setCgpa(ugDetails.getCgpa());
        dto.setActiveBacklogs(ugDetails.getActiveBacklogs());
        return dto;
    }
}
