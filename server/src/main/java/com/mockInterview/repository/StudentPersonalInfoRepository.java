package com.mockInterview.repository;

import com.mockInterview.entity.StudentPersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentPersonalInfoRepository extends JpaRepository<StudentPersonalInfo, Long> {
	StudentPersonalInfo findByUser_UserId(Long userId);
	StudentPersonalInfo findByParentMobileNumber(String parentMobileNumber);
	StudentPersonalInfo findByUser_Phone(String phone);


}
