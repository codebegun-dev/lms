package com.mockInterview.serviceImpl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
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

    @Value("${master.admin.email}")
    private String MASTER_ADMIN_EMAIL;

    @Value("${master.admin.password}")
    private String MASTER_ADMIN_PASSWORD;

    @Value("${app.frontend.base-url}")  // Dynamic frontend URL
    private String FRONTEND_BASE_URL;

    private static final SecureRandom secureRandom = new SecureRandom();
    
    @Override
    @Transactional
    public UserResponseDto createUser(UserRequestDto dto) {
        return createUsers(List.of(dto)).get(0);
    }

    @Transactional
    public List<UserResponseDto> createUsers(List<UserRequestDto> dtos) {

        if (dtos == null || dtos.isEmpty()) {
            throw new RuntimeException("User list is empty");
        }

        // 1️⃣ Extract emails and phones for bulk check
        List<String> emails = new ArrayList<>();
        List<String> phones = new ArrayList<>();

        for (UserRequestDto dto : dtos) {
            if (dto.getEmail() != null) emails.add(dto.getEmail());
            if (dto.getPhone() != null) phones.add(dto.getPhone());
        }

        // 2️⃣ Bulk duplicate checks
        List<User> existingEmails = userRepository.findByEmailIn(emails);
        List<User> existingPhones = userRepository.findByPhoneIn(phones);

        if (!existingEmails.isEmpty()) {
            throw new DuplicateFieldException("Duplicate emails found in the batch: " +
                    existingEmails.stream().map(User::getEmail).toList());
        }
        if (!existingPhones.isEmpty()) {
            throw new DuplicateFieldException("Duplicate phones found in the batch: " +
                    existingPhones.stream().map(User::getPhone).toList());
        }

        // 3️⃣ Map DTOs → Entities
        List<User> usersToSave = new ArrayList<>();
        User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL);

        for (UserRequestDto dto : dtos) {
            User user = userMapper.toEntity(dto);

            // Determine role
            Role role;
            boolean isAdminCreating = dto.getAdminAuth() != null;

            if (isAdminCreating) {
                // Admin-created user
                if (!MASTER_ADMIN_EMAIL.equals(dto.getAdminAuth().getEmail()) ||
                    !MASTER_ADMIN_PASSWORD.equals(dto.getAdminAuth().getPassword())) {
                    throw new RuntimeException("Unauthorized: Invalid master admin credentials");
                }

                role = roleRepository.findById(dto.getRoleId())
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + dto.getRoleId()));

                if (!"STUDENT".equalsIgnoreCase(role.getName()) && masterAdmin != null) {
                    // Non-student: use master admin password
                    user.setPassword(masterAdmin.getPassword());
                } else if ("STUDENT".equalsIgnoreCase(role.getName())) {
                    // Student: must provide password
                    if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                        throw new RuntimeException("Password is required for STUDENT role");
                    }
                    validatePassword(dto.getPassword());
                    user.setPassword(dto.getPassword());
                }

            } else {
                // Student self-registration
                role = roleRepository.findByName("STUDENT");
                if (role == null) {
                    throw new ResourceNotFoundException("Default STUDENT role not found. Please initialize STUDENT role.");
                }

                if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                    throw new RuntimeException("Password is required");
                }
                validatePassword(dto.getPassword());
                user.setPassword(dto.getPassword());
            }

            user.setRole(role);
            user.setStatus("ACTIVE");
            usersToSave.add(user);
        }

        // 4️⃣ Save all users in batch
        List<User> savedUsers = userRepository.saveAll(usersToSave);

     // 5️⃣ Send welcome emails
        for (User u : savedUsers) {
            if (!"STUDENT".equalsIgnoreCase(u.getRole().getName())) {
                // Generate reset token + link for non-student users
                String resetToken = generateResetToken(u.getEmail());
                String resetLink = FRONTEND_BASE_URL + "/reset-password?token=" + resetToken;

                emailService.sendNonStudentWelcomeEmail(
                	    u.getEmail(),                    // real email
                	    u.getFirstName(),
                	    masterAdmin.getPassword(),
                	    resetLink
                	);

            } else {
                // Student welcome email
                emailService.sendWelcomeEmail(u.getEmail(), u.getFirstName());
            }
        }


        // 6️⃣ Return response DTOs
        List<UserResponseDto> responseDtos = new ArrayList<>();
        for (User u : savedUsers) {
            responseDtos.add(userMapper.toResponse(u));
        }
        return responseDtos;
    }


    // ---------------- Strong password validation ----------------
    private void validatePassword(String password) {
        String pattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).{8,}$";
        if (!password.matches(pattern)) {
            throw new RuntimeException(
                "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long"
            );
        }
    }

    // ================= LOGIN =================
    @Override
    public UserResponseDto login(LoginRequestDto loginDto) {
        User user = userRepository.findByEmailOrPhone(loginDto.getEmailOrPhone(), loginDto.getEmailOrPhone());
        if (user == null) throw new ResourceNotFoundException("Invalid Credentials");
        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) throw new RuntimeException("Account inactive");

        if (!user.getPassword().equals(loginDto.getPassword())) throw new ResourceNotFoundException("Invalid Credentials");

        return userMapper.toResponse(user);
    }

 // ================= FORGOT PASSWORD =================
    @Override
    @Transactional
    public String forgotPassword(String emailOrPhone) {

        // 1️⃣ Clean up expired or used tokens first
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        // 2️⃣ Find user by email or phone
        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone);
        if (user == null || user.getEmail() == null) {
            throw new ResourceNotFoundException("User not found with this email/phone");
        }

        // 3️⃣ Generate a cryptographically secure random token
        byte[] randomBytes = new byte[48];
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        // 4️⃣ Save token to DB
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserEmail(user.getEmail());
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        // 5️⃣ Build dynamic reset link
        String resetLink = FRONTEND_BASE_URL + "/reset-password?token=" + token;

        // 6️⃣ Send reset email
        emailService.sendResetPasswordEmail(user.getEmail(), resetLink);

        // 7️⃣ Mask email/phone for response
        String masked = emailOrPhone.contains("@") ? EmailUtils.maskEmail(user.getEmail())
                                                   : EmailUtils.maskPhone(user.getPhone());

        return "Password reset link sent successfully to " + masked;
    }


    /// ================= RESET PASSWORD =================
    @Override
    @Transactional
    public String resetPassword(String token, String newPassword) {

        // 1️⃣ Clean up expired or already used tokens first
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        // 2️⃣ Find the token in DB
        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        if (resetToken == null || resetToken.isUsed() || resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Invalid or expired token");
        }

        // 3️⃣ Find the corresponding user
        User user = userRepository.findByEmailOrPhone(resetToken.getUserEmail(), resetToken.getUserEmail());
        if (user == null) throw new ResourceNotFoundException("User not found");

        // 4️⃣ Update password (plain text for now; encrypt later)
        user.setPassword(newPassword);
        userRepository.save(user);

        // 5️⃣ Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // 6️⃣ Optional: Clean expired/used tokens again to keep DB tidy
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        // 7️⃣ Return confirmation
        return "Password reset successfully";
    }

    // ================= GET ALL USERS =================
    public List<UserResponseDto> getAllActiveUsers() {
        return userRepository.findByStatus("ACTIVE").stream().map(userMapper::toResponse).toList();
    }

    public List<UserResponseDto> getAllUsersWithStatus() {
        return userRepository.findAll().stream().map(userMapper::toResponse).toList();
    }

    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toResponse(user);
    }

 // ================= UPDATE USER =================
    @Transactional
    public UserResponseDto updateUser(Long userId, UserUpdateRequestDto dto) {
        // 1️⃣ Fetch the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role currentRole = user.getRole(); // could be null

        // 2️⃣ Prevent Master Admin role changes
        if (currentRole != null && "MASTER_ADMIN".equalsIgnoreCase(currentRole.getName())) {
            if (dto.getRoleId() != null && !dto.getRoleId().equals(currentRole.getId())) {
                throw new RuntimeException("Master Admin role cannot be changed");
            }
        }

        // 3️⃣ Check for duplicate email
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail()) &&
            userRepository.findByEmail(dto.getEmail()) != null) {
            throw new DuplicateFieldException("Email already exists!");
        }

        // 4️⃣ Check for duplicate phone (including parent's phone)
        if (dto.getPhone() != null && !dto.getPhone().equals(user.getPhone()) &&
            (userRepository.findByPhone(dto.getPhone()) != null ||
             studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null)) {
            throw new DuplicateFieldException("Phone already exists!");
        }

        // 5️⃣ Update basic info (firstName, lastName, email, phone)
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());

        // 6️⃣ Update role if provided
        if (dto.getRoleId() != null) {
            // a) Must provide admin credentials to change role
            if (dto.getAdminAuth() == null ||
                !MASTER_ADMIN_EMAIL.equals(dto.getAdminAuth().getEmail()) ||
                !MASTER_ADMIN_PASSWORD.equals(dto.getAdminAuth().getPassword())) {
                throw new RuntimeException("Unauthorized: Admin credentials required to change role");
            }

            // b) Fetch the new role
            Role newRole = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            // c) Sync password if new role is non-student
            if (!"STUDENT".equalsIgnoreCase(newRole.getName()) &&
                (currentRole == null || !"MASTER_ADMIN".equalsIgnoreCase(currentRole.getName()))) {
                User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL);
                if (masterAdmin != null) user.setPassword(masterAdmin.getPassword());
            }

            // d) Assign the new role
            user.setRole(newRole);
        }

        // 7️⃣ Save the updated user
        User updatedUser = userRepository.save(user);

        // 8️⃣ Convert entity to response DTO
        return userMapper.toResponse(updatedUser);
    }




    // ================= DEACTIVATE / ACTIVATE =================
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole() != null ? user.getRole().getName() : "")) {
            throw new RuntimeException("Master Admin cannot be deactivated");
        }
        user.setStatus("INACTIVE");
        userRepository.save(user);
    }

    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) throw new RuntimeException("User already active");
        user.setStatus("ACTIVE");
        userRepository.save(user);
    }

    // ================= DELETE USER =================
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole() != null ? user.getRole().getName() : "")) {
            throw new RuntimeException("Master Admin cannot be deleted");
        }
        userRepository.delete(user);
    }

    // ================= SYNC PASSWORDS (batch safe) =================
    @Transactional
    public void syncPasswordsWithMasterAdmin() {
        User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL);
        if (masterAdmin == null) throw new RuntimeException("Master Admin not found");

        int batchSize = 100;
        int page = 0;
        List<User> batch;
        do {
            batch = userRepository.findByRole_NameNotInWithPaging(List.of("STUDENT"), PageRequest.of(page, batchSize));
            batch.forEach(u -> u.setPassword(masterAdmin.getPassword()));
            userRepository.saveAll(batch);
            page++;
        } while (!batch.isEmpty());
    }
    
 // ================= GENERATE RESET TOKEN =================
    private String generateResetToken(String userEmail) {
        // 1️⃣ Delete expired tokens first
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        // 2️⃣ Generate secure random token
        byte[] randomBytes = new byte[48];
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        // 3️⃣ Save token in DB
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserEmail(userEmail);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15)); // valid 15 min
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);

        return token;
    }

}
