package com.mockInterview.repository;

import com.mockInterview.entity.AdminPersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminPersonalInfoRepository extends JpaRepository<AdminPersonalInfo, Long> {
    AdminPersonalInfo findByUser_UserId(Long userId);
}
