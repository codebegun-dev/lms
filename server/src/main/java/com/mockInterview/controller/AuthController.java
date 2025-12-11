package com.mockInterview.controller;

import com.mockInterview.entity.Permission;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.responseDtos.LoginResponseDto;
import com.mockInterview.security.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ========================= LOGIN =========================
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {

        logger.info("Login attempt: {}", loginRequest.getEmailOrPhone());

        User user = userRepository.findByEmailOrPhone(
                loginRequest.getEmailOrPhone(),
                loginRequest.getEmailOrPhone()
        );

        if (user == null) {
            logger.warn("Login failed: user not found -> {}", loginRequest.getEmailOrPhone());
            throw new ResourceNotFoundException("Invalid email or phone");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            logger.warn("Login failed: inactive user -> {}", loginRequest.getEmailOrPhone());
            throw new ResourceNotFoundException("User is inactive");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            logger.warn("Login failed: wrong password -> {}", loginRequest.getEmailOrPhone());
            throw new ResourceNotFoundException("Incorrect password");
        }

        // ===================== GET ROLE =====================
        Role role = user.getRole();
        if (role == null) {
            throw new ResourceNotFoundException("User role not found");
        }

        // ===================== BASIC ROLE PERMISSIONS =====================
        Set<String> permissionNames = new HashSet<>();

        if (role.getPermissions() != null) {
            permissionNames.addAll(
                    role.getPermissions()
                            .stream()
                            .map(Permission::getName)
                            .collect(Collectors.toSet())
            );
        }

        // ===================== MASTER ADMIN GETS ALL PERMISSIONS =====================
        if ("MASTER_ADMIN".equalsIgnoreCase(role.getName())) {
            List<Permission> allPermissions = permissionRepository.findAll();

            for (Permission p : allPermissions) {
                if (p != null && p.getName() != null)
                    permissionNames.add(p.getName());
            }

            // Also add fallback wildcard
            permissionNames.add("ALL_PERMISSIONS");
        }

        // ==================== GENERATE JWT ====================
        String token = jwtUtil.generateToken(
                user.getUserId(),
                user.getEmail(),
                Collections.singletonList(role.getName()),
                new ArrayList<>(permissionNames)
        );

        // ==================== BUILD RESPONSE ====================
        LoginResponseDto response = new LoginResponseDto(
                user.getUserId(),
                user.getEmail(),
                token,
                role.getName(),
                new ArrayList<>(permissionNames)
        );

        logger.info("Login successful: userId={}, email={}", user.getUserId(), user.getEmail());
        return ResponseEntity.ok(response);
    }
}
