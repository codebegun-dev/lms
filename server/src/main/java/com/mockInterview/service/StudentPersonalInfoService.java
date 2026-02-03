//package com.mockInterview.service;
//
//import org.springframework.web.multipart.MultipartFile;
//
//import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
//import com.mockInterview.responseDtos.StudentPersonalInfoResponseDto;
//
//public interface StudentPersonalInfoService {
//
//    /**
//     * Get student personal info by userId
//     * - Student can fetch self
//     * - Admin / permitted user can fetch any
//     */
//    StudentPersonalInfoResponseDto getByUserId(Long userId);
//
//    /**
//     * Update student personal information
//     *
//     * Rules:
//     * - STUDENT_UPDATE_SELF → can update own profile
//     * - STUDENT_UPDATE_ANY  → can update any student
//     *
//     * @param targetUserId user whose profile is being updated
//     * @param request update payload (partial)
//     * @param file optional profile picture
//     */
//    StudentPersonalInfoResponseDto updateStudentPersonalInfo(
//            Long targetUserId,
//            StudentPersonalInfoUpdateRequest request,
//            MultipartFile file
//    );
//}

package com.mockInterview.service;

import com.mockInterview.requestDtos.StudentPersonalInfoUpdateRequest;
import com.mockInterview.responseDtos.StudentPersonalInfoResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface StudentPersonalInfoService {

    
    StudentPersonalInfoResponseDto updateStudentPersonalInfo(
            Long targetUserId,
            StudentPersonalInfoUpdateRequest request,
            MultipartFile file
    );

    /**
     * 🔍 READ STUDENT PERSONAL INFO
     *
     * Access Rules:
     * - STUDENT       → can read ONLY their own data
     * - MASTER_ADMIN  → can read any student's data
     * - Other roles   → permission based
     *
     * @param userId student userId
     * @return student personal info response
     */
    StudentPersonalInfoResponseDto getStudentPersonalInfoByUserId(Long userId);

	
}
