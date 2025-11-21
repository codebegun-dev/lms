package com.mockInterview.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.SalesCourseManagement;
@Repository
public interface SalesCourseManagementRepository extends JpaRepository<SalesCourseManagement, Long>{
	
	SalesCourseManagement findByEmail(String email);
	SalesCourseManagement findByPhone(String phone);
	List<SalesCourseManagement> findByStatus(String status);
	
	
	@Query("""
		       SELECT s.assignedTo.userId, COUNT(s)
		       FROM SalesCourseManagement s
		       WHERE s.status = 'NEW' AND s.assignedTo IS NOT NULL
		       GROUP BY s.assignedTo.userId
		       """)
		List<Object[]> getNewStudentCounts();
		
		List<SalesCourseManagement> findByAssignedTo_UserId(Long userId);

	    
	    List<SalesCourseManagement> findByAssignedTo_UserIdAndStatus(Long userId, String status);




	
	


	 

}
