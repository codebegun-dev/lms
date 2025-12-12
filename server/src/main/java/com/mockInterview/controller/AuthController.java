//
//
//package com.mockInterview.controller;
//
//import com.mockInterview.entity.Permission;
//import com.mockInterview.entity.Role;
//import com.mockInterview.entity.User;
//import com.mockInterview.exception.ResourceNotFoundException;
//import com.mockInterview.repository.PermissionRepository;
//import com.mockInterview.repository.UserRepository;
//import com.mockInterview.security.JwtUtil;
//import com.mockInterview.requestDtos.LoginRequestDto;
//import com.mockInterview.responseDtos.LoginResponseDto;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
//
//
//@RestController
//@RequestMapping("/api/users")
//public class AuthController {
//
//    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PermissionRepository permissionRepository;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @PostMapping("/login")
//    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
//
//        logger.info("Login attempt: {}", loginRequest.getEmailOrPhone());
//
//        User user = userRepository.findByEmailOrPhone(
//                loginRequest.getEmailOrPhone(),
//                loginRequest.getEmailOrPhone()
//        );
//
//        if (user == null) {
//            logger.warn("Login failed: user not found -> {}", loginRequest.getEmailOrPhone());
//            throw new ResourceNotFoundException("Invalid email or phone");
//        }
//
//        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
//            logger.warn("Login failed: inactive user -> {}", loginRequest.getEmailOrPhone());
//            throw new ResourceNotFoundException("User is inactive");
//        }
//
//        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//            logger.warn("Login failed: wrong password -> {}", loginRequest.getEmailOrPhone());
//            throw new ResourceNotFoundException("Incorrect password");
//        }
//
//        // gather role & permissions
//        Role role = user.getRole();
//        if (role == null) throw new ResourceNotFoundException("User role not found");
//
//        // role names list (we keep single role design)
//        List<String> roles = Collections.singletonList(role.getName());
//
//        // permission names from role
//        Set<String> permissionNames = new HashSet<>();
//        if (role.getPermissions() != null) {
//            for (Permission p : role.getPermissions()) {
//                if (p != null && p.getName() != null) permissionNames.add(p.getName());
//            }
//        }
//
//        // master admin: include all DB permissions + wildcard
//        if ("MASTER_ADMIN".equalsIgnoreCase(role.getName())) {
//            List<Permission> all = permissionRepository.findAll();
//            for (Permission p : all) if (p != null && p.getName() != null) permissionNames.add(p.getName());
//            permissionNames.add("ALL_PERMISSIONS");
//        }
//
//        List<String> permissions = new ArrayList<>(permissionNames);
//
//        // generate token with roles & permissions
//        String token = jwtUtil.generateToken(user.getUserId(), user.getEmail(), roles, permissions);
//
//        LoginResponseDto response = new LoginResponseDto(
//                user.getUserId(),
//                user.getEmail(),
//                token,
//                role.getName(),
//                permissions
//        );
//
//        logger.info("Login successful: userId={}, email={}", user.getUserId(), user.getEmail());
//        return ResponseEntity.ok(response);
//    }
//}





package com.mockInterview.controller;


import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;

import com.mockInterview.repository.UserRepository;
import com.mockInterview.security.JwtUtil;
import com.mockInterview.requestDtos.LoginRequestDto;
import com.mockInterview.responseDtos.LoginResponseDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/users")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {

        logger.info("Login attempt: {}", loginRequest.getEmailOrPhone());

        User user = userRepository.findByEmailOrPhone(
                loginRequest.getEmailOrPhone(),
                loginRequest.getEmailOrPhone()
        );

        if (user == null) throw new ResourceNotFoundException("Invalid email or phone");
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) throw new ResourceNotFoundException("User is inactive");

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            throw new ResourceNotFoundException("Incorrect password");

        Role role = user.getRole();
        if (role == null) throw new ResourceNotFoundException("User role not found");

        // 🔥 DO NOT PUT PERMISSIONS INSIDE TOKEN
        String token = jwtUtil.generateToken(
                user.getUserId(),
                user.getEmail(),
                role.getName()
        );

        logger.info("Login successful: userId={}, email={}", user.getUserId(), user.getEmail());

        return ResponseEntity.ok(new LoginResponseDto(token));
    }


}