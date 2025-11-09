package com.mockInterview.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.mockInterview.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmail(String email);
	User findByPhone(String phone);
	User findByEmailOrPhone(String email, String phone);
	User findByRole_Name(String roleName);
	 List<User> findByStatus(String status);
	 List<User> findByRoleNameIn(List<String> roleNames);
	 
	 List<User> findAllByRole_Name(String roleName);



}
