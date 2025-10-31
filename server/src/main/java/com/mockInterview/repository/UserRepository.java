package com.mockInterview.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmail(String email);
	User findByPhone(String phone);
	User findByEmailOrPhone(String email, String phone);
	 User findFirstByRole(Role role);

}
