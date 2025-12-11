package com.mockInterview.dataInitializer;


import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;

import com.mockInterview.repository.RoleRepository;
import com.mockInterview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;




@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${master.admin.email}")
    private String MASTER_ADMIN_EMAIL;

    @Value("${master.admin.password}")
    private String MASTER_ADMIN_PASSWORD;

    @Override
    public void run(String... args) throws Exception {
        
        ensureDefaultRoles();
        createMasterAdmin();
    }

   
    // ====================== Ensure fallback roles ======================
    private void ensureDefaultRoles() {
        createRoleIfAbsent("STUDENT");
        createRoleIfAbsent("DEFAULT");
        createRoleIfAbsent("MASTER_ADMIN");
        System.out.println("✔ Default roles ensured.");
    }

    private void createRoleIfAbsent(String roleName) {
        Role role = roleRepository.findByName(roleName);
        if (role == null) {
            role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
            System.out.println("→ Created fallback role: " + roleName);
        }
    }

    private void createMasterAdmin() {
        if (userRepository.existsByEmail(MASTER_ADMIN_EMAIL)) {
            System.out.println("✔ Master Admin already exists, skipping creation.");
            return;
        }

        // Ensure MASTER_ADMIN role exists
        Role masterRole = roleRepository.findByName("MASTER_ADMIN");
        if (masterRole == null) {
            masterRole = new Role();
            masterRole.setName("MASTER_ADMIN");
            roleRepository.save(masterRole);
        }

        User masterAdmin = new User();
        masterAdmin.setFirstName("Master");
        masterAdmin.setLastName("Admin");
        masterAdmin.setEmail(MASTER_ADMIN_EMAIL);
        masterAdmin.setPassword(passwordEncoder.encode(MASTER_ADMIN_PASSWORD));
        masterAdmin.setPhone("9999999999");
        masterAdmin.setRole(masterRole);
        masterAdmin.setStatus("ACTIVE");

        userRepository.save(masterAdmin);
        System.out.println("✔ Master Admin created successfully.");
    }  
}
