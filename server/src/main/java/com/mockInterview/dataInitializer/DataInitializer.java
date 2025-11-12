package com.mockInterview.dataInitializer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.mockInterview.entity.User;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.service.UserService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Value("${master.admin.email}")
    private String masterEmail;

    @Value("${master.admin.password}")
    private String masterPassword;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // 1️⃣ Check if Master Admin exists
        User masterAdmin = userRepository.findByEmail(masterEmail);
        boolean passwordChanged = false;
        boolean emailChanged = false;

        // 2️⃣ If not exist, create new Master Admin
        if (masterAdmin == null) {
            masterAdmin = new User();
            masterAdmin.setFirstName("Master");
            masterAdmin.setLastName("Admin");
            masterAdmin.setEmail(masterEmail);
            masterAdmin.setPhone("9999999999");
            masterAdmin.setPassword(masterPassword);
            masterAdmin.setStatus("ACTIVE");
            masterAdmin.setRole(null); // 🚫 No role assigned
            userRepository.save(masterAdmin);
            System.out.println("✅ Master Admin created with email: " + masterEmail);
        } 
        else {
            // 3️⃣ Handle Email change (if updated in properties)
            if (!masterAdmin.getEmail().equals(masterEmail)) {
                System.out.println("🔁 Master Admin email changed from " 
                    + masterAdmin.getEmail() + " → " + masterEmail);
                masterAdmin.setEmail(masterEmail);
                emailChanged = true;
            }

            // 4️⃣ Handle Password change (if updated in properties)
            if (!masterAdmin.getPassword().equals(masterPassword)) {
                System.out.println("🔒 Master Admin password changed via properties.");
                masterAdmin.setPassword(masterPassword);
                passwordChanged = true;
            }

            if (emailChanged || passwordChanged) {
                userRepository.save(masterAdmin);
            }
        }

        // 5️⃣ Sync sub-admin/instructor passwords only if master’s password changed
        if (passwordChanged) {
            userService.syncPasswordsWithMasterAdmin();
            System.out.println("🔁 Synced all Admin/SubAdmin/Instructor passwords with Master Admin.");
        } else {
            System.out.println("ℹ️ No Master Admin password change detected. Skipping sync.");
        }
    }
}
