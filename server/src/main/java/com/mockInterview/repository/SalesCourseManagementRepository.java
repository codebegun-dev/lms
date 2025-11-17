package com.mockInterview.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import com.mockInterview.entity.SalesCourseManagement;

public interface SalesCourseManagementRepository extends JpaRepository<SalesCourseManagement, Long>{
	
	SalesCourseManagement findByEmail(String email);
	SalesCourseManagement findByPhone(String phone);
	List<SalesCourseManagement> findByStatus(String status);


	 

}
