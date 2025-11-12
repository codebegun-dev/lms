package com.mockInterview.serviceImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.PasswordResetToken;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.mapper.UserMapper;
import com.mockInterview.repository.PasswordResetTokenRepository;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.requestDtos.UserUpdateRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.service.EmailService;
import com.mockInterview.service.UserService;
import com.mockInterview.util.EmailUtils;

import jakarta.transaction.Transactional;

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
    private RoleRepository roleRepository;

    @Autowired
    private UserMapper userMapper;

 // ✅ Inject Master Admin email from application.properties
    @Value("${master.admin.email}")
    private String masterEmail;

    @Override
    public UserResponseDto createUser(UserRequestDto dto) {

        // 1️⃣ Duplicate checks
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new DuplicateFieldException("Email already exists!");
        }
        if (userRepository.findByPhone(dto.getPhone()) != null) {
            throw new DuplicateFieldException("Phone number already exists!");
        }
        if (studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null) {
            throw new DuplicateFieldException("Phone number already exists!");
        }

        // 2️⃣ Map DTO → Entity
        User user = userMapper.toEntity(dto);

        // 3️⃣ Assign role dynamically
        Role role;
        if (dto.getRoleId() != null) {
            role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found with ID: " + dto.getRoleId()));
        } else {
            role = roleRepository.findByName("STUDENT");
            if (role == null) {
                throw new ResourceNotFoundException("Default STUDENT role not found. Please initialize STUDENT role.");
            }
        }
        user.setRole(role);
        user.setStatus("ACTIVE");

        // 4️⃣ For non-student roles → use Master Admin’s password
        if (!"STUDENT".equalsIgnoreCase(role.getName())) {
            User masterAdmin = userRepository.findByEmail(masterEmail); // ✅ FIXED: fetch by email instead of role
            if (masterAdmin == null) {
                throw new RuntimeException("Master Admin not found! Please check DataInitializer.");
            }
            user.setPassword(masterAdmin.getPassword());
        }

        // 5️⃣ Save user
        User savedUser = userRepository.save(user);

        // 6️⃣ Send welcome email
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());

        // 7️⃣ Return response DTO
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
        // 1️⃣ Fetch existing user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 2️⃣ Update basic fields
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        // 3️⃣ Update role dynamically if roleId is provided
        if (dto.getRoleId() != null) {
            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found with ID: " + dto.getRoleId()));
            user.setRole(role);
        }

        // 4️⃣ Save updated user
        User updatedUser = userRepository.save(user);

        // 5️⃣ Return response DTO
        return userMapper.toResponse(updatedUser);
    }


 // --- Deactivate user
    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Prevent deactivating MASTER_ADMIN
        if (user.getRole() != null && "MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new RuntimeException("Master Admin cannot be deactivated!");
        }

        // Soft delete for all other users
        user.setStatus("INACTIVE");
        userRepository.save(user);
    }

    // --- Activate user 
    @Override
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User is already active");
        }

        user.setStatus("ACTIVE");
        userRepository.save(user);
    }

    
 // --- Delete user permanently (Master Admin only)
    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Prevent deleting Master Admin itself
        if (user.getRole() != null && "MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new RuntimeException("Master Admin cannot be deleted!");
        }

        // Permanently delete user
        userRepository.delete(user);
    }
    
    
    @Transactional
    public void syncPasswordsWithMasterAdmin() {
        // ✅ Fetch master admin using email instead of role
        User masterAdmin = userRepository.findByEmail(masterEmail);
        if (masterAdmin == null) {
            throw new RuntimeException("Master Admin not found!");
        }

        // Get all roles except STUDENT
        List<Role> roles = roleRepository.findAll();
        List<String> targetRoles = new ArrayList<>();
        for (Role role : roles) {
            if (!"STUDENT".equalsIgnoreCase(role.getName())) {
                targetRoles.add(role.getName());
            }
        }

        // Find all users with these roles
        List<User> adminUsers = userRepository.findByRoleNameIn(targetRoles);

        // Update each user’s password to match Master Admin
        for (User user : adminUsers) {
            user.setPassword(masterAdmin.getPassword());
        }

        userRepository.saveAll(adminUsers);
    }



}
