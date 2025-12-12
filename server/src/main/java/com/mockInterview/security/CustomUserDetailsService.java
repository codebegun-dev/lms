package com.mockInterview.security;

import com.mockInterview.entity.User;
import com.mockInterview.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrPhone) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrPhone(emailOrPhone, emailOrPhone);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email or phone: " + emailOrPhone);
        }

        List<GrantedAuthority> authorities = user.getRole().getPermissions().stream()
                .map(p -> new SimpleGrantedAuthority(p.getName()))
                .collect(Collectors.toList());

        return new CustomUserDetails(
                user.getUserId(),
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
