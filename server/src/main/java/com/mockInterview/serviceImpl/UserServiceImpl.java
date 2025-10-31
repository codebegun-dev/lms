package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.PasswordResetToken;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.UserMapper;
import com.mockInterview.repository.PasswordResetTokenRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
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
    
    @Autowired
    private StudentPersonalInfoRepository studentPersonalInfoRepository;

    // --- Create user
    @Override
    public UserResponseDto createUser(UserRequestDto dto) {
        // Check if email already exists
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new DuplicateFieldException("Email already exists!");
        }

        // Check if phone already exists
        if (userRepository.findByPhone(dto.getPhone()) != null) {
            throw new DuplicateFieldException("Phone number already exists!");
        }

        // Check if phone matches any existing parent's number
        if (studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null) {
            throw new DuplicateFieldException("Phone number cannot be the same as any existing parent's mobile number!");
        }

        // Create and save user
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

//        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String resetLink = "http://localhost/reset-password?token=" + token;


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
    
    
    
 // --- Get all users
    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponseDto> result = new ArrayList<UserResponseDto>();
        for (User user : users) {
            result.add(UserMapper.toResponse(user));
        }
        return result;
    }

    // --- Get user by ID
    @Override
    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId).isPresent() ? userRepository.findById(userId).get() : null;
        if (user == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        return UserMapper.toResponse(user);
    }

    // --- Update user
    @Override
    public UserResponseDto updateUser(Long userId, UserRequestDto dto) {
        User user = null;
        if (userRepository.findById(userId).isPresent()) {
            user = userRepository.findById(userId).get();
        }

        if (user == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());

        User updatedUser = userRepository.save(user);
        return UserMapper.toResponse(updatedUser);
    }

    // --- Delete user
    @Override
    public void deleteUser(Long userId) {
        User user = null;
        if (userRepository.findById(userId).isPresent()) {
            user = userRepository.findById(userId).get();
        }

        if (user == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        userRepository.delete(user);
    }
}
