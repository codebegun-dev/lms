package com.mockInterview.service;

import com.mockInterview.responseDtos.StudentPGDetailsDto;

public interface StudentPGDetailsService {
    StudentPGDetailsDto getByUserId(Long userId);

    StudentPGDetailsDto updateDetails(StudentPGDetailsDto dto);
}
