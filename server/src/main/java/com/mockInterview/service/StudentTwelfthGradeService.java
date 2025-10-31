package com.mockInterview.service;

import com.mockInterview.responseDtos.StudentTwelfthGradeDto;

public interface StudentTwelfthGradeService {

    // ✅ Get Twelfth Grade details by userId
    StudentTwelfthGradeDto getTwelfthGradeDetails(Long userId);

    // ✅ Create or Update Twelfth Grade details
    StudentTwelfthGradeDto updateTwelfthGradeDetails(StudentTwelfthGradeDto dto);
}
