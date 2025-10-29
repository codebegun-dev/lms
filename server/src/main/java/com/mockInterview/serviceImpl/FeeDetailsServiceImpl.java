package com.mockInterview.serviceImpl;

import com.mockInterview.responseDtos.FeeDetailsDto;
import com.mockInterview.service.FeeDetailsService;
import org.springframework.stereotype.Service;

@Service
public class FeeDetailsServiceImpl implements FeeDetailsService {

    @Override
    public FeeDetailsDto getFeeDetailsForStudent(Long userId) {
        // Admin fixed data
        double totalFee = 50000;
        double paidFee = 25000;
        double balanceFee = totalFee - paidFee;

        return new FeeDetailsDto(totalFee, paidFee, balanceFee);
    }
}
