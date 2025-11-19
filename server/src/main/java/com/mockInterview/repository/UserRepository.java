package com.mockInterview.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findByEmail(String email);

	User findByPhone(String phone);

	User findByEmailOrPhone(String email, String phone);
	boolean existsByEmail(String email);


	User findByRole_Name(String roleName);
	List<User> findByRole(Role role);

	List<User> findByStatus(String status);

	@Query("SELECT u FROM User u WHERE u.role.name NOT IN :roleNames")
	List<User> findByRole_NameNotInWithPaging(List<String> roleNames, Pageable pageable);

	List<User> findByRole_NameNot(String roleName);

	List<User> findByStatusAndRole_NameNot(String status, String roleName);
	
	@Query("SELECT r.name AS roleName, COUNT(u) AS count " +
		       "FROM User u JOIN u.role r GROUP BY r.name")
		List<Object[]> findRoleWiseCounts();

		long count();
		long countByStatus(String status);

		List<User> findByRole_NameStartingWithAndStatus(String prefix, String status);

}
