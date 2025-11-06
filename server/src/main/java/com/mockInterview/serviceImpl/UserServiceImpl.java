package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.PasswordResetToken;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.UserMapper;
import com.mockInterview.repository.PasswordResetTokenRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.requestDtos.UserUpdateRequestDto;
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

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserResponseDto createUser(UserRequestDto dto) {

        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new DuplicateFieldException("Email already exists!");
        }

        if (userRepository.findByPhone(dto.getPhone()) != null) {
            throw new DuplicateFieldException("Phone number already exists!");
        }

        if (studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null) {
            throw new DuplicateFieldException("Phone number already exists!");
        }

        User user = userMapper.toEntity(dto);

        // ✅ Auto status
        if (dto.getRole() == Role.STUDENT) {
            user.setStatus("ACTIVE");
        } else {
            user.setStatus("ACTIVE"); // change to PENDING if needed
        }

        User savedUser = userRepository.save(user);
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());

        return userMapper.toResponse(savedUser);
    }


    @Override
    public UserResponseDto login(LoginRequestDto loginDto) {

        User user = userRepository.findByEmailOrPhone(loginDto.getEmailOrPhone(), loginDto.getEmailOrPhone());
        if (user == null) {
            throw new ResourceNotFoundException("Invalid Credentials");
        }

        if("INACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Account is inactive. Contact admin.");
        }

        // TODO: Replace with BCrypt
        if (!user.getPassword().equals(loginDto.getPassword())) {
            throw new ResourceNotFoundException("Invalid Credentials");
        }

        return userMapper.toResponse(user);
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
    public List<UserResponseDto> getAllActiveUsers() {
        List<User> users = userRepository.findByStatus("ACTIVE"); 
        List<UserResponseDto> result = new ArrayList<>();
        for (User user : users) {
            result.add(userMapper.toResponse(user));
        }
        return result;
    }
    
 // --- Get all users (active + inactive)
    public List<UserResponseDto> getAllUsersWithStatus() {
        List<User> users = userRepository.findAll(); 
        List<UserResponseDto> result = new ArrayList<>();
        for (User user : users) {
            result.add(userMapper.toResponse(user));
        }
        return result;
    }



    // --- Get user by ID
    @Override
    public UserResponseDto getUserById(Long userId) {
    	User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        return userMapper.toResponse(user);
    }

   
    @Override
    public UserResponseDto updateUser(Long userId, UserUpdateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Update allowed fields only
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }


    // --- Deactivate user
    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // ❌ Prevent deleting admins
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin user cannot be deleted!");
        }

        // ✅ Soft delete
        user.setStatus("INACTIVE");
        userRepository.save(user);
    }
    
    @Override
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (user.getStatus().equalsIgnoreCase("ACTIVE")) {
            throw new RuntimeException("User is already active");
        }

        user.setStatus("ACTIVE");
        userRepository.save(user);
    }


}
