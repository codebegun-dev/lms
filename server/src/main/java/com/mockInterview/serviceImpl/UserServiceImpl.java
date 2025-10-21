package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.PasswordResetToken;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.UserMapper;
import com.mockInterview.repository.PasswordResetTokenRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.service.EmailService;
import com.mockInterview.service.UserService;
import com.mockInterview.util.EmailUtils;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    // --- Create user
    @Override
    public UserResponseDto createUser(UserRequestDto dto) {
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new DuplicateFieldException("email already exists!");
        }
        if (userRepository.findByPhone(dto.getPhone()) != null) {
            throw new DuplicateFieldException("phoneNumber already exists!");
        }

        User user = UserMapper.toEntity(dto);
        User savedUser = userRepository.save(user);

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());

        return UserMapper.toResponse(savedUser);
    }

    // --- Login (return only userId, email, role)
    @Override
    public UserResponseDto login(LoginRequestDto loginDto) {
        User user = userRepository.findByEmailOrPhone(loginDto.getEmailOrPhone(), loginDto.getEmailOrPhone());
        if (user == null) {
            throw new ResourceNotFoundException("Invalid Credentials");
        }
        if (!user.getPassword().equals(loginDto.getPassword())) {
            throw new ResourceNotFoundException("Invalid Credentials");
        }

//        // Create response with only userId, email, role
//        UserResponseDto response = new UserResponseDto();
//        response.setUserId(user.getUserId());
//        response.setEmail(user.getEmail());
//        response.setRole(user.getRole());

        return UserMapper.toResponse(user);
    }

    public String forgotPassword(String emailOrPhone) {
        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone);
        if (user == null || user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new ResourceNotFoundException("User not found with this email");
        }

        String token = java.util.UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserEmail(user.getEmail());
        resetToken.setExpiryTime(expiry);
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
         try {
            emailService.sendResetPasswordEmail(user.getEmail(), resetLink);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset email: " + e.getMessage());
        }

        String masked;
        if (emailOrPhone.contains("@")) {
            masked = EmailUtils.maskEmail(user.getEmail());
        } else {
            masked = EmailUtils.maskPhone(user.getPhone());
        }

        return "Password reset link sent successfully to " + masked;
    }



    // --- Reset password
    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        if (resetToken == null) {
            throw new ResourceNotFoundException("Invalid or expired reset link");
        }

        if (resetToken.isUsed() || resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Invalid or expired reset link");
        }

        User user = userRepository.findByEmailOrPhone(resetToken.getUserEmail(), resetToken.getUserEmail());
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        user.setPassword(newPassword); // Later replace with BCrypt for production
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        return "Password reset successfully";
    }
}
