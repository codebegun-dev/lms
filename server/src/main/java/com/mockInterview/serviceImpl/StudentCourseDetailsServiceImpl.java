package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentCourseDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentCourseDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentCourseDetailsDto;
import com.mockInterview.service.StudentCourseDetailsService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentCourseDetailsServiceImpl implements StudentCourseDetailsService {

    @Autowired
    private StudentCourseDetailsRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public StudentCourseDetailsDto getByUserId(Long userId) {
        StudentCourseDetails details = repository.findByUser_UserId(userId);
        if (details == null) {
            throw new ResourceNotFoundException("Course details not found for user ID: " + userId);
        }

        StudentCourseDetailsDto dto = new StudentCourseDetailsDto();
        dto.setId(details.getId());
        dto.setUserId(details.getUser().getUserId());
        dto.setCourseName(details.getCourseName());
        dto.setBatchName(details.getBatchName());
        dto.setCourseStartDate(details.getCourseStartDate());
        return dto;
    }

    @Override
    public StudentCourseDetailsDto updateCourseDetails(StudentCourseDetailsDto dto) {
        // Find existing course details for the user
        StudentCourseDetails details = repository.findByUser_UserId(dto.getUserId());
        
        // If details not found, create a new object
        if (details == null) {
            details = new StudentCourseDetails();
            Optional<User> userOpt = userRepository.findById(dto.getUserId());
            if (!userOpt.isPresent()) {
                throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
            }
            details.setUser(userOpt.get());
        }

        // Update course details
        details.setCourseName(dto.getCourseName());
        details.setBatchName(dto.getBatchName());;
        details.setCourseStartDate(dto.getCourseStartDate());

        // Save and prepare response DTO
        StudentCourseDetails saved = repository.save(details);

        StudentCourseDetailsDto response = new StudentCourseDetailsDto();
        response.setId(saved.getId());
        response.setUserId(saved.getUser().getUserId());
        response.setCourseName(saved.getCourseName());
        response.setBatchName(saved.getBatchName());
        response.setCourseStartDate(saved.getCourseStartDate());

        return response;
    }

}
