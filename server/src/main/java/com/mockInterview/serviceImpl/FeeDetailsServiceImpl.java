package com.mockInterview.serviceImpl;

import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.FeeDetailsDto;
import com.mockInterview.service.FeeDetailsService;
import com.mockInterview.util.RoleValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeeDetailsServiceImpl implements FeeDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public FeeDetailsDto getFeeDetailsForStudent(Long userId) {

        // Fetch user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // ⭐ Allow both STUDENT and MASTER_ADMIN
        RoleValidator.validateStudentOrMasterAdmin(user);

        // Static fee values
        double totalFee = 50000;
        double paidFee = 25000;
        double balanceFee = totalFee - paidFee;

        return new FeeDetailsDto(totalFee, paidFee, balanceFee);
    }
}
