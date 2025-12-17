package com.mockInterview.serviceImpl;


import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.entity.PasswordResetToken;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.exception.UnauthorizedActionException;
import com.mockInterview.mapper.UserMapper;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.repository.PasswordResetTokenRepository;
import com.mockInterview.requestDtos.UserRequestDto;
import com.mockInterview.responseDtos.UserResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.EmailService;
import com.mockInterview.service.UserService;
import com.mockInterview.util.EmailUtils;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentPersonalInfoRepository studentPersonalInfoRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    private static final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend.base-url}")
    private String FRONTEND_BASE_URL;


    
    @Override
    @Transactional
    public UserResponseDto createUser(UserRequestDto dto) {

        if (dto == null)
            throw new UnauthorizedActionException("User data is empty");

        // ===================== DUPLICATE VALIDATION ======================
        if (dto.getEmail() != null && userRepository.findByEmail(dto.getEmail()) != null)
            throw new DuplicateFieldException("Email already exists!");
        if (dto.getPhone() != null &&
                (userRepository.findByPhone(dto.getPhone()) != null ||
                 studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null))
            throw new DuplicateFieldException("Phone already exists!");

        // ===================== CHECK LOGGED-IN USER =====================
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = null;
        if (currentUserId != null) {
            currentUser = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new UnauthorizedActionException("Invalid logged-in user"));
        }

        // ---------------- PUBLIC STUDENT ----------------
        if (currentUser == null) {
            // No user logged in → public student
            if (dto.getPassword() == null || dto.getPassword().isEmpty())
                throw new UnauthorizedActionException("Password is required for student registration");

            validatePassword(dto.getPassword());

            // Map DTO to entity as public student
            User user = userMapper.toEntity(dto, true);
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setStatus("ACTIVE");

            User saved = userRepository.save(user);

            // Send welcome email
            emailService.sendWelcomeEmail(saved.getEmail(), saved.getFirstName());

            return userMapper.toResponse(saved);
        }

        // ---------------- MASTER_ADMIN USER CREATION ----------------
        if (!"MASTER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            throw new UnauthorizedActionException("Only MASTER_ADMIN can create users");
        }

        // Map DTO to entity as admin creation (mapper handles roleId)
        User user = userMapper.toEntity(dto, false);

        // Use MASTER_ADMIN's password
        user.setPassword(currentUser.getPassword());
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        // Send password reset link to the created user
        String token = generateToken();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(savedUser)
                .expiryDate(new Date(System.currentTimeMillis() + 3600 * 1000)) // 1 hour expiry
                .build();
        tokenRepository.save(resetToken);

        String resetLink = FRONTEND_BASE_URL + "/reset-password?token=" + token;
        emailService.sendResetPasswordEmail(savedUser.getEmail(), resetLink);

        return userMapper.toResponse(savedUser);
    }


   

    // ================= UPDATE USER =================
    @Override
    @Transactional
    public UserResponseDto updateUser(Long userId, UserRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Prevent editing MASTER_ADMIN
        if (user.getRole() != null && "MASTER_ADMIN".equalsIgnoreCase(user.getRole().getName()))
            throw new UnauthorizedActionException("Master Admin details cannot be edited");

        if ("INACTIVE".equalsIgnoreCase(user.getStatus()))
            throw new IllegalStateException("Cannot update an inactive user. Please activate the user first.");

        
        // Duplicate checks
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail()) &&
            userRepository.findByEmail(dto.getEmail()) != null)
            throw new DuplicateFieldException("Email already exists!");
        if (dto.getPhone() != null && !dto.getPhone().equals(user.getPhone()) &&
            (userRepository.findByPhone(dto.getPhone()) != null ||
             studentPersonalInfoRepository.findByParentMobileNumber(dto.getPhone()) != null))
            throw new DuplicateFieldException("Phone already exists!");

        // Update fields if provided
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            validatePassword(dto.getPassword());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Optional role update
        if (dto.getRoleId() != null) {
            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            user.setRole(role);
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    // ================= MASTER_ADMIN ASSIGN ROLE =================
    @Override
    @Transactional
    public UserResponseDto assignRoleToUser(Long userId, Long roleId) {
        String currentUserEmail = (String) SecurityContextHolder.getContext().getAuthentication().getName();
        User masterAdmin = userRepository.findByEmail(currentUserEmail);
        if (masterAdmin == null || masterAdmin.getRole() == null || 
            !"MASTER_ADMIN".equalsIgnoreCase(masterAdmin.getRole().getName()))
            throw new UnauthorizedActionException("Only Master Admin can assign roles");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role roleToAssign = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        if ("MASTER_ADMIN".equalsIgnoreCase(roleToAssign.getName()) ||
            "STUDENT".equalsIgnoreCase(roleToAssign.getName()))
            throw new UnauthorizedActionException("Cannot assign MASTER_ADMIN or STUDENT role");

        user.setRole(roleToAssign);
        userRepository.save(user);

        return userMapper.toResponse(user);
    }

    // ================= SYNC PASSWORDS WITH MASTER_ADMIN =================
    @Override
    @Transactional
    public void syncPasswordsWithMasterAdmin() {
        User masterAdmin = userRepository.findByRole_Name("MASTER_ADMIN");
        if (masterAdmin == null) throw new ResourceNotFoundException("Master Admin not found");

        List<User> nonStudentUsers = userRepository.findByRole_NameNot("STUDENT");
        String encryptedPassword = masterAdmin.getPassword();
        nonStudentUsers.forEach(u -> u.setPassword(encryptedPassword));
        userRepository.saveAll(nonStudentUsers);
    }

    @Override
    public Map<String, Object> getUsersWithCounts(int page, int size) {

    	Pageable pageable = PageRequest.of(page, size, Sort.by("userId").ascending());


        List<UserResponseDto> users = new ArrayList<>();

        // ================= COUNTS =================
        long totalUsers = userRepository.countByRole_NameNot("MASTER_ADMIN");
        long activeUsersCount = userRepository.countByStatusAndRole_NameNot("ACTIVE", "MASTER_ADMIN");
        long inactiveUsersCount = userRepository.countByStatusAndRole_NameNot("INACTIVE", "MASTER_ADMIN");

        // ================= FETCH ACTIVE USERS FIRST =================
        Page<User> activePage = userRepository.findByStatusAndRole_NameNot(
                "ACTIVE", "MASTER_ADMIN", pageable
        );

        for (User user : activePage.getContent()) {
            users.add(userMapper.toResponse(user));
        }

        // ================= FILL WITH INACTIVE USERS =================
        if (users.size() < size) {

            int remaining = size - users.size();

            Pageable inactivePageable = PageRequest.of(
                    0, // always start inactive from first page
                    remaining,
                    Sort.by("userId").ascending()
            );

            Page<User> inactivePage = userRepository.findByStatusAndRole_NameNot(
                    "INACTIVE", "MASTER_ADMIN", inactivePageable
            );

            for (User user : inactivePage.getContent()) {
                users.add(userMapper.toResponse(user));
            }
        }

        // ================= ROLE COUNTS =================
        List<Object[]> roleCountsList = userRepository.findRoleWiseCountsExcludingMasterAdmin();
        Map<String, Long> roleCounts = new HashMap<>();
        for (Object[] row : roleCountsList) {
            roleCounts.put((String) row[0], (Long) row[1]);
        }

        // ================= RESPONSE =================
        Map<String, Object> response = new HashMap<>();
        response.put("USERS", users);
        response.put("TOTAL_USERS", totalUsers);
        response.put("ACTIVE_USERS", activeUsersCount);
        response.put("INACTIVE_USERS", inactiveUsersCount);
        response.put("ROLE_COUNTS", roleCounts);
        response.put("CURRENT_PAGE", page);
        response.put("PAGE_SIZE", size);
        response.put("TOTAL_PAGES", (int) Math.ceil((double) totalUsers / size));

        return response;
    }


    @Override
    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole() != null ? user.getRole().getName() : ""))
            throw new UnauthorizedActionException("Master Admin details cannot be accessed");

        return userMapper.toResponse(user);
    }

 // ================= STATUS MANAGEMENT =================
    @Override
    @Transactional
    public void changeUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Prevent changing status of MASTER_ADMIN
        if ("MASTER_ADMIN".equalsIgnoreCase(user.getRole() != null ? user.getRole().getName() : "")) {
            throw new UnauthorizedActionException("Master Admin cannot be deactivated or modified");
        }

        // Check if already in desired status
        String currentStatus = user.getStatus();
        String newStatus = active ? "ACTIVE" : "INACTIVE";
        if (newStatus.equalsIgnoreCase(currentStatus)) {
            throw new UnauthorizedActionException("User is already " + newStatus);
        }

        user.setStatus(newStatus);
        userRepository.save(user);
    }


    

    // ================= ASSIGNABLE USERS =================
    @Override
    public List<UserResponseDto> getAssignableUsers() {
        List<Role> assignableRoles = roleRepository.findAll().stream()
                .filter(r -> !"MASTER_ADMIN".equalsIgnoreCase(r.getName()) &&
                             !"STUDENT".equalsIgnoreCase(r.getName()))
                .collect(Collectors.toList());

        List<User> users = userRepository.findByRoleInAndStatus(assignableRoles, "ACTIVE");
        return users.stream().map(userMapper::toResponse).toList();
    }

    // ================= PASSWORD VALIDATION =================
    private void validatePassword(String password) {
        String pattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#]).{8,}$";
        if (!password.matches(pattern))
            throw new UnauthorizedActionException(
                "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long"
            );
    }

    // ================= BULK CHANGE ROLES =================
    @Override
    @Transactional
    public void bulkChangeUsersRoleByAdmin(Long fromRoleId, Long toRoleId) {
        Role fromRole = roleRepository.findById(fromRoleId)
                .orElseThrow(() -> new ResourceNotFoundException("From Role not found"));
        Role toRole = roleRepository.findById(toRoleId)
                .orElseThrow(() -> new ResourceNotFoundException("To Role not found"));

        if ("MASTER_ADMIN".equalsIgnoreCase(toRole.getName()) ||
            "STUDENT".equalsIgnoreCase(toRole.getName()))
            throw new UnauthorizedActionException("Cannot assign MASTER_ADMIN or STUDENT role");

        List<User> users = userRepository.findByRole(fromRole);
        if (users.isEmpty()) throw new ResourceNotFoundException("No users found with fromRole");

        users.forEach(u -> u.setRole(toRole));
        userRepository.saveAll(users);
    }
    
   
 // ================= FORGOT PASSWORD =================
    @Override
    @Transactional
    public String forgotPassword(String emailOrPhone) {
        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone);
        if (user == null) throw new ResourceNotFoundException("User not found");

        // Generate token
        String token = generateToken();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(new Date(System.currentTimeMillis() + 3600 * 1000)) // 1 hour expiry
                .build();
        tokenRepository.save(resetToken);

        String resetLink = FRONTEND_BASE_URL + "/reset-password?token=" + token;

        // Mask email/phone before sending
        String maskedEmail = EmailUtils.maskEmail(user.getEmail());
//        String maskedPhone = EmailUtils.maskPhone(user.getPhone());

        // You can choose what to display in the message
        String message = "Password reset link sent to your email: " + maskedEmail;
                         

        // Send email
        emailService.sendResetPasswordEmail(user.getEmail(), resetLink);

        return message;
    }

    private String generateToken() {
        byte[] bytes = new byte[20];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // ================= RESET PASSWORD =================
    @Override
    @Transactional
    public String resetPassword(String token, String newPassword) {
        validatePassword(newPassword);

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
            .orElseThrow(() -> new ResourceNotFoundException("Invalid token"));

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);

        return "Password updated successfully";
    }
    
    

}
