package com.mockInterview.service;

import com.mockInterview.responseDtos.StudentUGDetailsDto;

public interface StudentUGDetailsService {
    StudentUGDetailsDto getByUserId(Long userId);

    StudentUGDetailsDto updateDetails(StudentUGDetailsDto dto);
}
