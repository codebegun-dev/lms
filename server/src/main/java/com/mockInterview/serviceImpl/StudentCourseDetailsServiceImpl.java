package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentCourseDetails;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentCourseDetailsRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentCourseDetailsDto;
import com.mockInterview.service.StudentCourseDetailsService;


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

        return convertToDto(details);
    }

    @Override
    public StudentCourseDetailsDto updateCourseDetails(StudentCourseDetailsDto dto) {

        // Fetch User
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

       

        // Fetch or create new course details
        StudentCourseDetails details = repository.findByUser_UserId(dto.getUserId());
        if (details == null) {
            details = new StudentCourseDetails();
            details.setUser(user);
        }

        // Update fields
        details.setCourseName(dto.getCourseName());
        details.setBatchName(dto.getBatchName());
        details.setCourseStartDate(dto.getCourseStartDate());

        // Save
        StudentCourseDetails saved = repository.save(details);

        return convertToDto(saved);
    }

    // ===================== Helper method ======================
    private StudentCourseDetailsDto convertToDto(StudentCourseDetails entity) {
        StudentCourseDetailsDto dto = new StudentCourseDetailsDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getUserId());
        dto.setCourseName(entity.getCourseName());
        dto.setBatchName(entity.getBatchName());
        dto.setCourseStartDate(entity.getCourseStartDate());
        return dto;
    }
}
