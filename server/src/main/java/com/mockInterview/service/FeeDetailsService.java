package com.mockInterview.service;

import com.mockInterview.responseDtos.FeeDetailsDto;

public interface FeeDetailsService {
    FeeDetailsDto getFeeDetailsForStudent(Long userId);
}
