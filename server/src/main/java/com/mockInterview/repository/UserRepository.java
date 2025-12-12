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

    // Fetch by unique fields
    User findByEmail(String email);
    User findByPhone(String phone);
    User findByEmailOrPhone(String email, String phone);
    boolean existsByEmail(String email);

    // Fetch users by role entity
    List<User> findByRole(Role role);
    List<User> findByRoleInAndStatus(List<Role> roles, String status);

    // Fetch users by role name
    User findByRole_Name(String roleName);
    List<User> findByRole_NameNot(String roleName);
    List<User> findByRole_NameNot(String roleName, Pageable pageable);
    List<User> findByRole_NameStartingWithAndStatus(String prefix, String status);

    // Fetch users by status
    List<User> findByStatus(String status);
    List<User> findByStatusAndRole_NameNot(String status, String roleName);

    // Role-wise count for dashboard
    @Query("SELECT r.name AS roleName, COUNT(u) AS count " +
           "FROM User u JOIN u.role r GROUP BY r.name")
    List<Object[]> findRoleWiseCounts();

    long count();
    long countByStatus(String status);
}
