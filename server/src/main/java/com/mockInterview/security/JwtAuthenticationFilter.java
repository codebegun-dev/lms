package com.mockInterview.security; 

import com.mockInterview.entity.Permission;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.RoleModulePermission;
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
                    if (role != null && role.getModulePermissions() != null) {

                        for (RoleModulePermission rmp : role.getModulePermissions()) {
                            Permission p = rmp.getPermission();  // get the Permission object
                            if (p != null && p.getName() != null) {
                            	permissionNames.add(
                            		    p.getName().trim().toUpperCase()
                            		);

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
                            	permissionNames.add(
                            		    p.getName().trim().toUpperCase()
                            		);

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
