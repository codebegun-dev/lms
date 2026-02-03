//package com.mockInterview.serviceImpl;
//
//import com.mockInterview.entity.StudentPersonalInfo;
//import com.mockInterview.entity.User;
//import com.mockInterview.exception.DuplicateFieldException;
//import com.mockInterview.exception.ResourceNotFoundException;
//
//import com.mockInterview.repository.StudentPersonalInfoRepository;
//import com.mockInterview.repository.UserRepository;
//import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
//import com.mockInterview.responseDtos.StudentPersonalInfoResponseDto;
//
//import com.mockInterview.service.StudentPersonalInfoService;
//import com.mockInterview.util.FileStorageUtil;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
//
//import java.io.IOException;
//
//@Service
//public class StudentPersonalInfoServiceImpl implements StudentPersonalInfoService {
//
//    @Autowired
//    private StudentPersonalInfoRepository infoRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public StudentPersonalInfoResponseDto updateStudentPersonalInfo(
//            Long targetUserId,
//            StudentPersonalInfoUpdateRequest request,
//            MultipartFile file) {
//
//        // ================================
//        // 🔍 Fetch User
//        // ================================
//        User user = userRepository.findById(targetUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        StudentPersonalInfo info = infoRepository.findByUser_UserId(targetUserId);
//        if (info == null) {
//            info = new StudentPersonalInfo();
//            info.setUser(user);
//        }
//
//        // ================================
//        // 🔍 Normalize input (trim spaces)
//        // ================================
//        String newEmail = request.getEmail() != null ? request.getEmail().trim() : null;
//        String newPhone = request.getPhone() != null ? request.getPhone().trim() : null;
//        String newParentNumber = request.getParentMobileNumber() != null ? request.getParentMobileNumber().trim() : null;
//
//        // ================================
//        // 🔍 Parent mobile number validations
//        // ================================
//        if (newParentNumber != null) {
//
//            // 1️⃣ Parent number cannot match student phone
//            if (newParentNumber.equals(user.getPhone())) {
//                throw new DuplicateFieldException(
//                        "Parent mobile number cannot match student's own phone number"
//                );
//            }
//
//            // 2️⃣ Parent number cannot match any other student's phone number
//            User userWithPhone = userRepository.findByPhone(newParentNumber);
//            if (userWithPhone != null && !userWithPhone.getUserId().equals(targetUserId)) {
//                throw new DuplicateFieldException(
//                        "Parent mobile number cannot match another student's phone number"
//                );
//            }
//
//            // 3️⃣ Parent number cannot be used as parent number for any other student
//            StudentPersonalInfo existingParent =
//                    infoRepository.findByParentMobileNumber(newParentNumber);
//
//            if (existingParent != null &&
//                !existingParent.getUser().getUserId().equals(targetUserId)) {
//                throw new DuplicateFieldException(
//                        "Parent mobile number already assigned to another student"
//                );
//            }
//
//            info.setParentMobileNumber(newParentNumber);
//        }
//
//        // ================================
//        // 🔍 Email uniqueness
//        // ================================
//        if (newEmail != null) {
//            User existingEmail = userRepository.findByEmail(newEmail);
//            if (existingEmail != null && !existingEmail.getUserId().equals(targetUserId)) {
//                throw new DuplicateFieldException("Email already exists");
//            }
//            user.setEmail(newEmail);
//        }
//
//        // ================================
//        // 🔍 Student phone uniqueness
//        // ================================
//        if (newPhone != null) {
//            User existingPhone = userRepository.findByPhone(newPhone);
//            if (existingPhone != null && !existingPhone.getUserId().equals(targetUserId)) {
//                throw new DuplicateFieldException("Phone number already exists");
//            }
//            user.setPhone(newPhone);
//        }
//
//        // ================================
//        // 🔄 Update student basic info
//        // ================================
//        if (request.getFirstName() != null) user.setFirstName(request.getFirstName().trim());
//        if (request.getLastName() != null) user.setLastName(request.getLastName().trim());
//
//        userRepository.save(user);
//
//        // ================================
//        // 🔄 Update student personal info
//        // ================================
//        if (request.getGender() != null) info.setGender(request.getGender());
//        if (request.getDateOfBirth() != null) info.setDateOfBirth(request.getDateOfBirth());
//        if (request.getBloodGroup() != null) info.setBloodGroup(request.getBloodGroup());
//
//        // ================================
//        // 📷 File upload
//        // ================================
//        if (file != null && !file.isEmpty()) {
//            FileStorageUtil.deleteFile(info.getProfilePicturePath());
//            try {
//                String path = FileStorageUtil.saveFile(file, targetUserId, "images");
//                info.setProfilePicturePath(path);
//            } catch (IOException e) {
//                throw new RuntimeException("Profile image upload failed");
//            }
//        }
//
//        infoRepository.save(info);
//
//        return mapToDto(info);
//    }
//
//    @Override
//    public StudentPersonalInfoResponseDto getByUserId(Long userId) {
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        StudentPersonalInfo info =
//                infoRepository.findByUser_UserId(userId);
//
//        if (info == null) {
//            info = new StudentPersonalInfo();
//            info.setUser(user);
//        }
//
//        return mapToDto(info);
//    }
//
//    private StudentPersonalInfoResponseDto mapToDto(StudentPersonalInfo info) {
//
//        StudentPersonalInfoResponseDto dto = new StudentPersonalInfoResponseDto();
//
//        dto.setUserId(info.getUser().getUserId());
//        dto.setFirstName(info.getUser().getFirstName());
//        dto.setLastName(info.getUser().getLastName());
//        dto.setEmail(info.getUser().getEmail());
//        dto.setPhone(info.getUser().getPhone());
//        dto.setGender(info.getGender());
//        dto.setDateOfBirth(info.getDateOfBirth());
//        dto.setParentMobileNumber(info.getParentMobileNumber());
//        dto.setBloodGroup(info.getBloodGroup());
//
//        String baseUrl = ServletUriComponentsBuilder
//                .fromCurrentContextPath()
//                .toUriString();
//
//        if (info.getProfilePicturePath() != null) {
//            dto.setProfilePicturePath(baseUrl + "/uploads/" + info.getProfilePicturePath());
//        } else {
//            dto.setProfilePicturePath(
//                "https://ui-avatars.com/api/?name=" +
//                (info.getUser().getFirstName() != null
//                    ? info.getUser().getFirstName()
//                    : "User")
//            );
//        }
//        
//        dto.setUpdatedAt(info.getUpdatedAt());
//        dto.setUpdatedBy(info.getUpdatedBy() != null ? String.valueOf(info.getUpdatedBy()) : null);
//
//
//        return dto;
//    }
//}

package com.mockInterview.serviceImpl;

import java.io.IOException;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.access.AccessDeniedException;

import com.mockInterview.entity.StudentPersonalInfo;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.StudentPersonalInfoService;
import com.mockInterview.util.FileStorageUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentPersonalInfoServiceImpl implements StudentPersonalInfoService {

    private final StudentPersonalInfoRepository personalInfoRepository;
    private final UserRepository userRepository;
  

    @Override
    public StudentPersonalInfoResponseDto updateStudentPersonalInfo(
            Long targetUserId,
            StudentPersonalInfoUpdateRequest request,
            MultipartFile file
    ) {

        User loggedInUser = getCurrentUser();
        validateUpdatePermission(loggedInUser, targetUserId);

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        
        // 2️⃣ User email must be unique
        if (request.getEmail() != null &&
            !request.getEmail().equalsIgnoreCase(targetUser.getEmail())) {

            User existingUser = userRepository.findByEmail(request.getEmail());

            if (existingUser != null &&
                !existingUser.getUserId().equals(targetUserId)) {
                throw new DuplicateFieldException("Email already used by another user");
            }
        }
        
     // ================= DUPLICATE NUMBER VALIDATION =================

     // 1️⃣ User phone must be unique
     if (request.getPhone() != null &&
         !request.getPhone().equals(targetUser.getPhone())) {

         User existingUser = userRepository.findByPhone(request.getPhone());

         if (existingUser != null &&
             !existingUser.getUserId().equals(targetUserId)) {
             throw new DuplicateFieldException("Phone number already used by another user");
         }
     }

     // 2️⃣ Parent mobile must NOT match any user phone
     if (request.getParentMobileNumber() != null) {

         User userWithSamePhone =
                 userRepository.findByPhone(request.getParentMobileNumber());

         if (userWithSamePhone != null) {
             throw new DuplicateFieldException(
                 "Parent mobile number cannot be same as any user phone number"
             );
         }

         // 3️⃣ Parent mobile must NOT match student's own phone
         if (request.getPhone() != null &&
             request.getParentMobileNumber().equals(request.getPhone())) {
             throw new DuplicateFieldException(
                 "Parent mobile number cannot be same as student phone number"
             );
         }

         if (targetUser.getPhone() != null &&
             request.getParentMobileNumber().equals(targetUser.getPhone())) {
             throw new DuplicateFieldException(
                 "Parent mobile number cannot be same as student phone number"
             );
         }
     }


        StudentPersonalInfo info =
                personalInfoRepository.findByUser_UserId(targetUserId);

        if (info == null) {
            info = new StudentPersonalInfo();
            info.setUser(targetUser);
        }

        // ---------- USER BASIC INFO ----------
        if (request.getFirstName() != null)
            targetUser.setFirstName(request.getFirstName());

        if (request.getLastName() != null)
            targetUser.setLastName(request.getLastName());

        if (request.getEmail() != null)
            targetUser.setEmail(request.getEmail());

        if (request.getPhone() != null)
            targetUser.setPhone(request.getPhone());

        // ---------- PERSONAL INFO ----------
        if (request.getGender() != null)
            info.setGender(request.getGender());

        if (request.getDateOfBirth() != null)
            info.setDateOfBirth(request.getDateOfBirth());

        if (request.getParentMobileNumber() != null)
            info.setParentMobileNumber(request.getParentMobileNumber());

        if (request.getBloodGroup() != null)
            info.setBloodGroup(request.getBloodGroup());

     // ---------- PROFILE IMAGE ----------
        if (file != null && !file.isEmpty()) {
            try {
                String imagePath =
                        FileStorageUtil.saveFile(file, targetUserId, "profile");
                info.setProfilePicturePath(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile image", e);
            }
        }


        personalInfoRepository.save(info);
        userRepository.save(targetUser);

        return mapToResponseDto(info);
    }

    @Override
    public StudentPersonalInfoResponseDto getStudentPersonalInfoByUserId(Long userId) {

        User loggedInUser = getCurrentUser();

        if ("STUDENT".equalsIgnoreCase(loggedInUser.getRole().getName())
                && !loggedInUser.getUserId().equals(userId)) {
            throw new AccessDeniedException(
                    "Students can view only their own profile"
            );
        }

        StudentPersonalInfo info =
                personalInfoRepository.findByUser_UserId(userId);

        if (info == null) {
            throw new ResourceNotFoundException("Student personal info not found");
        }

        return mapToResponseDto(info);
    }

    // ================= SECURITY =================

    private User getCurrentUser() {

        Long currentUserId = SecurityUtils.getCurrentUserId();

        if (currentUserId == null) {
            throw new AccessDeniedException("Unauthenticated access");
        }

        return userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Logged-in user not found"));
    }

    private void validateUpdatePermission(User loggedInUser, Long targetUserId) {

    	User targetUser = userRepository.findById(targetUserId)
    	        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    	if (!"STUDENT".equalsIgnoreCase(targetUser.getRole().getName())) {
    	    throw new AccessDeniedException(
    	        "Personal info can be updated only for STUDENT users"
    	    );
    	}


        // MASTER_ADMIN → full access
        if (SecurityUtils.isMasterAdmin()) {
            return; 
        }

        // OTHER ROLES → permission required
        if (!SecurityUtils.hasAuthority("UPDATE_STUDENT")) {
            throw new AccessDeniedException(
                    "You do not have permission to update student details"
            );
        }
    }

    // ================= MAPPER =================

    private StudentPersonalInfoResponseDto mapToResponseDto(StudentPersonalInfo info) {

        StudentPersonalInfoResponseDto dto = new StudentPersonalInfoResponseDto();

        dto.setUserId(info.getUser().getUserId());
        dto.setFirstName(info.getUser().getFirstName());
        dto.setLastName(info.getUser().getLastName());
        dto.setEmail(info.getUser().getEmail());
        dto.setPhone(info.getUser().getPhone());
        dto.setGender(info.getGender());
        dto.setDateOfBirth(info.getDateOfBirth());
        dto.setParentMobileNumber(info.getParentMobileNumber());
        dto.setBloodGroup(info.getBloodGroup());
        dto.setProfilePicturePath(info.getProfilePicturePath());
        
        dto.setUpdatedAt(info.getUpdatedAt());
        dto.setUpdatedBy(info.getUpdatedBy() != null ? String.valueOf(info.getUpdatedBy()) : null);


        return dto;
    }
}
