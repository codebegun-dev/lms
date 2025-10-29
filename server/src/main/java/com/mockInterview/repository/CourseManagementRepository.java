package com.mockInterview.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.CourseManagement;

@Repository
public interface CourseManagementRepository extends JpaRepository<CourseManagement, Long>{
	
	
	
	    
	    boolean existsByCourseName(String courseName);
	    Optional<CourseManagement> findByCourseName(String courseName); 

	}


