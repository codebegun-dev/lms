package com.mockInterview.dataInitializer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${master.admin.email}")
    private String MASTER_ADMIN_EMAIL;

    @Value("${master.admin.password}")
    private String MASTER_ADMIN_PASSWORD;

    @Override
    public void run(String... args) throws Exception {

        // Preload STUDENT role
        createRoleIfNotFound("STUDENT");

        // Preload MASTER_ADMIN role
        Role masterRole = createRoleIfNotFound("MASTER_ADMIN");

        // Preload DEFAULT role
        createRoleIfNotFound("DEFAULT");

        // Preload Master Admin user
        User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL);
        if (masterAdmin == null) {
            masterAdmin = new User();
            masterAdmin.setFirstName("Master");
            masterAdmin.setLastName("Admin");
            masterAdmin.setEmail(MASTER_ADMIN_EMAIL);
            masterAdmin.setPassword(MASTER_ADMIN_PASSWORD);
            masterAdmin.setPhone("9999999999");
            masterAdmin.setRole(masterRole); // assign MASTER_ADMIN role
            masterAdmin.setStatus("ACTIVE");
            userRepository.save(masterAdmin); 
        }
    }

    // Helper method to create role if it does not exist
    private Role createRoleIfNotFound(String roleName) {
        Role role = roleRepository.findByName(roleName);
        if (role == null) {
            role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
        return role;
    }
}
