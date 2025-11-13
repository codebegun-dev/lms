//package com.mockInterview.dataInitializer;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import com.mockInterview.entity.Role;
//import com.mockInterview.entity.User;
//import com.mockInterview.repository.RoleRepository;
//import com.mockInterview.repository.UserRepository;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    @Autowired
//    private RoleRepository roleRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Value("${master.admin.email}")
//    private String MASTER_ADMIN_EMAIL;
//
//    @Value("${master.admin.password}")
//    private String MASTER_ADMIN_PASSWORD;
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Preload STUDENT role
//        Role studentRole = roleRepository.findByName("STUDENT");
//        if (studentRole == null) {
//            studentRole = new Role();
//            studentRole.setName("STUDENT");
//            roleRepository.save(studentRole);
//        }
//
//        // Preload MASTER_ADMIN role
//        Role masterRole = roleRepository.findByName("MASTER_ADMIN");
//        if (masterRole == null) {
//            masterRole = new Role();
//            masterRole.setName("MASTER_ADMIN");
//            roleRepository.save(masterRole);
//        }
//
//        // Preload Master Admin user
//        User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL);
//        if (masterAdmin == null) {
//            masterAdmin = new User();
//            masterAdmin.setFirstName("Master");
//            masterAdmin.setLastName("Admin");
//            masterAdmin.setEmail(MASTER_ADMIN_EMAIL);
//            masterAdmin.setPassword(MASTER_ADMIN_PASSWORD);
//            masterAdmin.setPhone("9999999999");
//            masterAdmin.setRole(masterRole); // assign role here
//            masterAdmin.setStatus("ACTIVE");
//            userRepository.save(masterAdmin);
//        }
//    }
//
//}

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
        // 1️⃣ Preload STUDENT role only
        Role studentRole = roleRepository.findByName("STUDENT");
        if (studentRole == null) {
            studentRole = new Role();
            studentRole.setName("STUDENT");
            roleRepository.save(studentRole);
        }

        // 2️⃣ Preload Master Admin user (without auto-creating MASTER_ADMIN role)
        User masterAdmin = userRepository.findByEmail(MASTER_ADMIN_EMAIL);
        if (masterAdmin == null) {
            masterAdmin = new User();
            masterAdmin.setFirstName("Master");
            masterAdmin.setLastName("Admin");
            masterAdmin.setEmail(MASTER_ADMIN_EMAIL);
            masterAdmin.setPassword(MASTER_ADMIN_PASSWORD);
            masterAdmin.setPhone("9999999999");
            masterAdmin.setStatus("ACTIVE");
            // Master Admin role will be assigned manually later
            userRepository.save(masterAdmin); 
        }
    }
}

