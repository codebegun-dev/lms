package com.mockInterview.service;

import com.mockInterview.entity.StudentUGDetails;
import com.mockInterview.responseDtos.StudentUGDetailsDto;

public interface StudentUGDetailsService {
    StudentUGDetailsDto getByUserId(Long userId);

    StudentUGDetailsDto updateDetails(StudentUGDetails dto);
}
