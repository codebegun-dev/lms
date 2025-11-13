package com.mockInterview.serviceImpl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.PasswordResetToken;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.exception.UnauthorizedActionException;
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
    private UserRepository userRepository;

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

    @Value("${app.frontend.base-url}")
    private String FRONTEND_BASE_URL;

    @Value("${master.admin.email}")
    private String MASTER_ADMIN_EMAIL;

    private static final SecureRandom secureRandom = new SecureRandom();

    // ================= CREATE USER =================
    @Override
    @Transactional
    public UserResponseDto createUser(UserRequestDto dto) {
        if (dto == null) throw new UnauthorizedActionException("User data is empty");

        // Duplicate checks
        if (dto.getEmail() != null && userRepository.findByEmail(dto.getEmail()) != null)
            throw new DuplicateFieldException("Email already exists!");
        if (dto.getPhone() != null &&
            (userRepository.findByPhone(dto.getPhone()) != null ||
             studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null))
            throw new DuplicateFieldException("Phone already exists!");

        // Map DTO → Entity
        User user = userMapper.toEntity(dto);
        Role role;

        if (dto.getAdminAuthId() != null) {
            // Admin-created user
            User masterAdmin = userRepository.findById(dto.getAdminAuthId())
                    .orElseThrow(() -> new UnauthorizedActionException("Unauthorized: Invalid admin ID"));

            if (dto.getRoleId() == null)
                throw new UnauthorizedActionException("Role is required when created by admin");

            role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + dto.getRoleId()));

            // Prevent assigning MASTER_ADMIN or STUDENT
            if ("MASTER_ADMIN".equalsIgnoreCase(role.getName())) {
                throw new UnauthorizedActionException("You cannot assign MASTER_ADMIN role");
            }

            // Non-student password synced with Master Admin
            if (!"STUDENT".equalsIgnoreCase(role.getName())) {
                user.setPassword(masterAdmin.getPassword());
            }

        } else {
            // Student self-registration
            role = roleRepository.findByName("STUDENT");
            if (role == null) throw new ResourceNotFoundException("Default STUDENT role not found.");
            if (dto.getPassword() == null || dto.getPassword().isEmpty())
                throw new UnauthorizedActionException("Password is required for self-registration");
            validatePassword(dto.getPassword());
            user.setPassword(dto.getPassword());
        }

        user.setRole(role);
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        // Send emails
        if ("STUDENT".equalsIgnoreCase(role.getName()) && dto.getAdminAuthId() == null) {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());
        } else {
            String resetToken = generateResetToken(savedUser.getEmail());
            String resetLink = FRONTEND_BASE_URL + "/reset-password?token=" + resetToken;
            emailService.sendNonStudentWelcomeEmail(
                    savedUser.getEmail(),
                    savedUser.getFirstName(),
                    savedUser.getPassword(),
                    resetLink
            );
        }

        return userMapper.toResponse(savedUser);
    }

    // ================= UPDATE USER =================
    @Override
    @Transactional
    public UserResponseDto updateUser(Long userId, UserUpdateRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role currentRole = user.getRole();

        // MASTER ADMIN IMMUTABLE CHECK
        if (currentRole != null && "MASTER_ADMIN".equalsIgnoreCase(currentRole.getName())) {
            throw new UnauthorizedActionException("Master Admin details cannot be edited");
        }

        // Duplicate checks
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail()) &&
            userRepository.findByEmail(dto.getEmail()) != null) {
            throw new DuplicateFieldException("Email already exists!");
        }
        if (dto.getPhone() != null && !dto.getPhone().equals(user.getPhone()) &&
            (userRepository.findByPhone(dto.getPhone()) != null ||
             studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null)) {
            throw new DuplicateFieldException("Phone already exists!");
        }

        // Update basic info
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());

        // Update role only if provided
        if (dto.getRoleId() != null) {
            if (dto.getAdminAuthId() == null)
                throw new UnauthorizedActionException("Admin credentials required to change role");

            User masterAdmin = userRepository.findById(dto.getAdminAuthId())
                    .orElseThrow(() -> new UnauthorizedActionException("Unauthorized: Invalid admin ID"));

            Role newRole = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

            // Prevent MASTER_ADMIN or STUDENT assignment
            if ("MASTER_ADMIN".equalsIgnoreCase(newRole.getName())) {
                throw new UnauthorizedActionException("You cannot assign MASTER_ADMIN role");
            }

            // Sync password for non-students
            if (!"STUDENT".equalsIgnoreCase(newRole.getName())) {
                user.setPassword(masterAdmin.getPassword());
            }

            user.setRole(newRole);
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    // ================= SYNC PASSWORDS =================
    @Transactional
    public void syncPasswordsWithMasterAdmin() {
        User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL);
        if (masterAdmin == null) throw new ResourceNotFoundException("Master Admin not found");

        List<User> nonStudentUsers = userRepository.findByRole_NameNotInWithPaging(List.of("STUDENT"), Pageable.unpaged());
        nonStudentUsers.forEach(u -> u.setPassword(masterAdmin.getPassword()));
        userRepository.saveAll(nonStudentUsers);
    }

    // ================= LOGIN =================
    @Override
    public UserResponseDto login(LoginRequestDto loginDto) {
        User user = userRepository.findByEmailOrPhone(loginDto.getEmailOrPhone(), loginDto.getEmailOrPhone());
        if (user == null) throw new ResourceNotFoundException("Invalid Credentials");
        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) throw new UnauthorizedActionException("Account inactive");
        if (!user.getPassword().equals(loginDto.getPassword())) throw new ResourceNotFoundException("Invalid Credentials");
        return userMapper.toResponse(user);
    }

    // ================= FORGOT PASSWORD =================
    @Override
    @Transactional
    public String forgotPassword(String emailOrPhone) {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone);
        if (user == null || user.getEmail() == null) throw new ResourceNotFoundException("User not found");

        byte[] randomBytes = new byte[48];
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserEmail(user.getEmail());
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        String resetLink = FRONTEND_BASE_URL + "/reset-password?token=" + token;
        emailService.sendResetPasswordEmail(user.getEmail(), resetLink);

        String masked = emailOrPhone.contains("@") ? EmailUtils.maskEmail(user.getEmail())
                                                   : EmailUtils.maskPhone(user.getPhone());
        return "Password reset link sent successfully to " + masked;
    }

    // ================= RESET PASSWORD =================
    @Override
    @Transactional
    public String resetPassword(String token, String newPassword) {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        if (resetToken == null || resetToken.isUsed() || resetToken.getExpiryTime().isBefore(LocalDateTime.now()))
            throw new ResourceNotFoundException("Invalid or expired token");

        User user = userRepository.findByEmailOrPhone(resetToken.getUserEmail(), resetToken.getUserEmail());
        if (user == null) throw new ResourceNotFoundException("User not found");

        user.setPassword(newPassword);
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        return "Password reset successfully";
    }

    // ================= GET USERS =================
    @Override
    public List<UserResponseDto> getAllActiveUsers() {
        return userRepository.findByStatusAndRole_NameNot("ACTIVE", "MASTER_ADMIN")
                             .stream()
                             .map(userMapper::toResponse)
                             .toList();
    }

    @Override
    public List<UserResponseDto> getAllUsersWithStatus() {
        return userRepository.findByRole_NameNot("MASTER_ADMIN")
                             .stream()
                             .map(userMapper::toResponse)
                             .toList();
    }

    @Override
    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Optional: Only allow certain roles to fetch Master Admin if needed
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole() != null ? user.getRole().getName() : "")) {
            throw new UnauthorizedActionException("Master Admin details cannot be accessed");
        }

        return userMapper.toResponse(user);
    }

    // ================= DEACTIVATE / ACTIVATE =================
    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole() != null ? user.getRole().getName() : ""))
            throw new UnauthorizedActionException("Master Admin cannot be deactivated");
        user.setStatus("INACTIVE");
        userRepository.save(user);
    }

    @Override
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) 
            throw new UnauthorizedActionException("User already active");
        user.setStatus("ACTIVE");
        userRepository.save(user);
    }

    // ================= DELETE USER =================
    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole() != null ? user.getRole().getName() : ""))
            throw new UnauthorizedActionException("Master Admin cannot be deleted");
        userRepository.delete(user);
    }

    // ================= GENERATE RESET TOKEN =================
    private String generateResetToken(String userEmail) {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        byte[] randomBytes = new byte[48];
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserEmail(userEmail);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        return token;
    }

    // ================= PASSWORD VALIDATION =================
    private void validatePassword(String password) {
        String pattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).{8,}$";
        if (!password.matches(pattern)) {
            throw new UnauthorizedActionException(
                "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long"
            );
        }
    }
}
