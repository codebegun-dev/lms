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

        initializeRoles();
        initializeMasterAdmin();
    }

    // ========================= ROLE SETUP =========================
    private void initializeRoles() {

        if (roleRepository.count() > 0) {
            return; // Roles already exist → skip
        }

        Role student = new Role();
        student.setName("STUDENT");
        roleRepository.save(student);

        Role master = new Role();
        master.setName("MASTER_ADMIN");
        roleRepository.save(master);

        Role defaultRole = new Role();
        defaultRole.setName("DEFAULT");
        roleRepository.save(defaultRole);

        System.out.println("✔ Default roles initialized.");
    }

    // ========================= MASTER ADMIN SETUP =========================
    private void initializeMasterAdmin() {

        // Check with lightweight existence check (no full row fetch)
        if (userRepository.existsByEmail(MASTER_ADMIN_EMAIL)) {
            return; // Already exists → skip
        }

        Role masterRole = roleRepository.findByName("MASTER_ADMIN");

        User masterAdmin = new User();
        masterAdmin.setFirstName("Master"); 
        masterAdmin.setLastName("Admin");
        masterAdmin.setEmail(MASTER_ADMIN_EMAIL);
        masterAdmin.setPassword(MASTER_ADMIN_PASSWORD);
        masterAdmin.setPhone("9999999999");
        masterAdmin.setRole(masterRole);
        masterAdmin.setStatus("ACTIVE");

        userRepository.save(masterAdmin);

        System.out.println("✔ Master Admin created.");
    }
}
