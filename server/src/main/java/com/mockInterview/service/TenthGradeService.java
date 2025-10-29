package com.mockInterview.service;

import com.mockInterview.responseDtos.TenthGradeDto;

public interface TenthGradeService {
    TenthGradeDto getTenthGradeDetails(Long userId);
    TenthGradeDto updateTenthGradeDetails(TenthGradeDto dto);
}
