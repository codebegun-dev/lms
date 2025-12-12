//package com.mockInterview.security;
//
//import com.mockInterview.entity.Permission;
//import com.mockInterview.entity.Role;
//import com.mockInterview.entity.User;
//import com.mockInterview.repository.PermissionRepository;
//import com.mockInterview.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.util.StringUtils;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import java.io.IOException;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Component
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PermissionRepository permissionRepository; // needed for MASTER_ADMIN all perms
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        try {
//            String token = getJwtFromRequest(request);
//
//            if (token != null && jwtUtil.validateToken(token)) {
//                Long userId = jwtUtil.getUserIdFromToken(token);
//
//                // load user from DB and verify status
//                User user = userRepository.findById(userId).orElse(null);
//                if (user != null && "ACTIVE".equalsIgnoreCase(user.getStatus())) {
//
//                    Role role = user.getRole();
//
//                    // collect permissions from role (DB source)
//                    Set<String> permissionNames = new HashSet<>();
//                    if (role != null && role.getPermissions() != null) {
//                        for (Permission p : role.getPermissions()) {
//                            if (p != null && p.getName() != null) permissionNames.add(p.getName());
//                        }
//                    }
//
//                    // if master admin, give all permissions (read from permissions table)
//                    if (role != null && "MASTER_ADMIN".equalsIgnoreCase(role.getName())) {
//                        List<Permission> all = permissionRepository.findAll();
//                        for (Permission p : all) {
//                            if (p != null && p.getName() != null) permissionNames.add(p.getName());
//                        }
//                        // also add a wildcard authority for convenience
//                        permissionNames.add("ALL_PERMISSIONS");
//                    }
//
//                    List<SimpleGrantedAuthority> authorities = permissionNames.stream()
//                            .map(SimpleGrantedAuthority::new)
//                            .collect(Collectors.toList());
//
//                    CustomUserDetails userDetails = new CustomUserDetails(
//                            user.getUserId(),
//                            user.getEmail(),
//                            user.getPassword(),
//                            authorities
//                    );
//
//                    UsernamePasswordAuthenticationToken authentication =
//                            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
//
//                    SecurityContextHolder.getContext().setAuthentication(authentication);
//                }
//            }
//        } catch (Exception ex) {
//            System.err.println("JWT Authentication failed: " + ex.getMessage());
//        }
//
//        filterChain.doFilter(request, response);
//    }
//
//    private String getJwtFromRequest(HttpServletRequest request) {
//        String bearer = request.getHeader("Authorization");
//        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) return bearer.substring(7);
//        return null;
//    }
//}



package com.mockInterview.security;

import com.mockInterview.entity.Permission;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.*;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter { 

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = getJwtFromRequest(request);

            if (token != null && jwtUtil.validateToken(token)) {

                Long userId = jwtUtil.getUserIdFromToken(token);

                User user = userRepository.findById(userId).orElse(null);

                if (user != null && "ACTIVE".equalsIgnoreCase(user.getStatus())) {

                    // ===================== LOAD PERMISSIONS FROM DB =====================
                    Set<String> permissionNames = new HashSet<String>();

                    Role role = user.getRole();
                    if (role != null && role.getPermissions() != null) {

                        for (Permission p : role.getPermissions()) {
                            if (p != null && p.getName() != null) {
                                permissionNames.add(p.getName());
                            }
                        }
                    }

                    // ===================== MASTER_ADMIN WILDCARD =====================
                    if (role != null && "MASTER_ADMIN".equalsIgnoreCase(role.getName())) {

                        permissionNames.add("ALL_PERMISSIONS"); // wildcard

                        // load all DB permissions (safe defensive logic)
                        List<Permission> all = permissionRepository.findAll();
                        for (Permission p : all) {
                            if (p != null && p.getName() != null) {
                                permissionNames.add(p.getName());
                            }
                        }
                    }

                    // ===================== CONVERT TO AUTHORITIES =====================
                    List<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();

                    for (String perm : permissionNames) {
                        authorities.add(new SimpleGrantedAuthority(perm));
                    }

                    CustomUserDetails userDetails = new CustomUserDetails(
                            user.getUserId(),
                            user.getEmail(),
                            user.getPassword(),
                            authorities
                    );

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    authorities
                            );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

        } catch (Exception ex) {
            System.out.println("JWT Auth Error: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");

        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
