package com.mockInterview.serviceImpl;

import com.mockInterview.entity.StudentPersonalInfo;
import com.mockInterview.entity.User;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.StudentPersonalInfoRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.responseDtos.StudentPersonalInfoDto;
import com.mockInterview.service.StudentPersonalInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Service
public class StudentPersonalInfoServiceImpl implements StudentPersonalInfoService {

    @Autowired
    private StudentPersonalInfoRepository infoRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = System.getProperty("user.home")
            + File.separator + "uploads" + File.separator + "images";

    @Override
    public StudentPersonalInfoDto updateInfo(StudentPersonalInfoDto dto) {
        // Fetch user
    	Optional<User> userOpt = userRepository.findById(dto.getUserId());
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
    	}
    	User user = userOpt.get();

        // Fetch or create personal info
        StudentPersonalInfo info = infoRepository.findByUser_UserId(dto.getUserId());
        if (info == null) {
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

        // Validate mobile numbers
        if (dto.getMobileNumber() != null && dto.getParentMobileNumber() != null &&
                dto.getMobileNumber().trim().equals(dto.getParentMobileNumber().trim())) {
            throw new IllegalArgumentException("Student mobile number cannot be the same as parent mobile number");
        }

        // Check if parent mobile number is already used by another student
        StudentPersonalInfo existingParent = infoRepository.findByParentMobileNumber(dto.getParentMobileNumber());
        if (existingParent != null && existingParent.getUser().getUserId() != dto.getUserId()) {
            throw new IllegalArgumentException("Parent mobile number already used by another student");
        }

        // Check if student mobile number is already used by another student
        User existingStudent = userRepository.findByPhone(dto.getMobileNumber());
        if (existingStudent != null && existingStudent.getUserId() != dto.getUserId()) {
            throw new IllegalArgumentException("Student mobile number already exists");
        }

        // Update User fields
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getMobileNumber());
        userRepository.save(user);

        // Update StudentPersonalInfo fields
        info.setSurName(dto.getSurName());
        info.setGender(dto.getGender());
        info.setDateOfBirth(dto.getDateOfBirth());
        info.setParentMobileNumber(dto.getParentMobileNumber());
        info.setBloodGroup(dto.getBloodGroup());
        infoRepository.save(info);

        return mapToDto(info);
    }

    @Override
    public StudentPersonalInfoDto updateProfileImage(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("File is empty");

        StudentPersonalInfo info = infoRepository.findByUser_UserId(userId);
        if (info == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

        try {
            String userFolder = UPLOAD_DIR + File.separator + userId;
            File folder = new File(userFolder);
            if (!folder.exists() && !folder.mkdirs()) throw new IOException("Failed to create directory: " + userFolder);

            // Delete old image if exists
            if (info.getProfilePicturePath() != null) {
                File oldFile = new File(info.getProfilePicturePath());
                if (oldFile.exists()) oldFile.delete();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
            String filePath = userFolder + File.separator + fileName;
            file.transferTo(new File(filePath));

            info.setProfilePicturePath(filePath);
            infoRepository.save(info);

        } catch (IOException e) {
            throw new RuntimeException("Error saving profile image: " + e.getMessage(), e);
        }

        return mapToDto(info);
    }

    @Override
    public StudentPersonalInfoDto getByUserId(Long userId) {
    	Optional<User> userOpt = userRepository.findById(userId);
    	if (!userOpt.isPresent()) {
    	    throw new ResourceNotFoundException("User not found with ID: " + userId);
    	}
    	User user = userOpt.get();

        StudentPersonalInfo info = infoRepository.findByUser_UserId(userId);

        // If StudentPersonalInfo does not exist yet, create empty info to avoid null fields
        if (info == null) {
            info = new StudentPersonalInfo();
            info.setUser(user);
        }

        return mapToDto(info);
    }

    private StudentPersonalInfoDto mapToDto(StudentPersonalInfo info) {
        StudentPersonalInfoDto dto = new StudentPersonalInfoDto();

        // User fields
        dto.setUserId(info.getUser().getUserId());
        dto.setFirstName(info.getUser().getFirstName());
        dto.setLastName(info.getUser().getLastName());
        dto.setMobileNumber(info.getUser().getPhone());

        // StudentPersonalInfo fields
        dto.setSurName(info.getSurName());
        dto.setGender(info.getGender());
        dto.setDateOfBirth(info.getDateOfBirth());
        dto.setParentMobileNumber(info.getParentMobileNumber());
        dto.setBloodGroup(info.getBloodGroup());

        // Profile picture handling
        String filePath = info.getProfilePicturePath();
        String baseUrl = "http://localhost:8080";

        if (filePath != null) {
            // If profile picture exists
            String fileName = new File(filePath).getName();
            dto.setProfilePicturePath(baseUrl + "/images/" + info.getUser().getUserId() + "/" + fileName);
        } else {
            // If no profile image, show first letter of user's name as avatar
            String firstLetter = "U";
            if (info.getUser().getFirstName() != null && !info.getUser().getFirstName().isEmpty()) {
                firstLetter = info.getUser().getFirstName().substring(0, 1).toUpperCase();
            }
            dto.setProfilePicturePath(baseUrl + "/avatar/" + firstLetter);
        }

        return dto;
    }
}
