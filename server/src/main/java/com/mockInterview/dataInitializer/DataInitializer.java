package com.mockInterview.dataInitializer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.User;
import com.mockInterview.entity.Role;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.service.UserService;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserService userService;

    // Inject master admin credentials from application.properties
    @Value("${master.admin.email}")
    private String masterEmail;

    @Value("${master.admin.password}")
    private String masterPassword;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // 1️⃣ Create MASTER_ADMIN role if it doesn't exist
        Role masterRole = roleRepository.findByName("MASTER_ADMIN");
        if (masterRole == null) {
            masterRole = new Role();
            masterRole.setName("MASTER_ADMIN");
            masterRole.setPermissions(Arrays.asList(
                    "UserManagement",
                    "RoleManagement",
                    "CourseManagement",
                    "BatchManagement",
                    "QuestionBank",
                    "FullAccess"
            ));
            masterRole = roleRepository.save(masterRole);
        }

        // 2️⃣ Create or update Master Admin user
        User masterAdmin = userRepository.findByEmail(masterEmail);
        boolean passwordChanged = false;

        if (masterAdmin == null) {
            // Create new Master Admin
            masterAdmin = new User();
            masterAdmin.setFirstName("Master");
            masterAdmin.setLastName("Admin");
            masterAdmin.setEmail(masterEmail);
            masterAdmin.setPhone("9999999999");
            masterAdmin.setPassword(masterPassword);
            masterAdmin.setRole(masterRole);
            masterAdmin.setStatus("ACTIVE");
            userRepository.save(masterAdmin);
            System.out.println("✅ Master Admin created with email: " + masterEmail);
        } else {
            // If password in properties has changed → update it
            if (!masterAdmin.getPassword().equals(masterPassword)) {
                masterAdmin.setPassword(masterPassword);
                userRepository.save(masterAdmin);
                passwordChanged = true;
                System.out.println("🔄 Master Admin password updated from properties file.");
            }
        }

        // 3️⃣ Sync only if Master Admin password changed
        if (passwordChanged) {
            userService.syncPasswordsWithMasterAdmin();
            System.out.println("🔁 Synced all Admin/SubAdmin/Instructor passwords with Master Admin.");
        } else {
            System.out.println("ℹ️ No password change detected. Skipping sync.");
        }
    }
}
