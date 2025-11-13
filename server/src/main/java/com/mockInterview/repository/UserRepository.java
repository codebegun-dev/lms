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

    // --- Basic lookups ---
    User findByEmail(String email);
    User findByPhone(String phone);
    User findByEmailOrPhone(String email, String phone);
    User findByRole_Name(String roleName);
    List<User> findByStatus(String status);
    List<User> findByRole_NameIn(List<String> roleNames);
    List<User> findAllByRole_Name(String roleName);
    List<User> findByRole(Role role);

    // --- Bulk checks for createUsers ---
    List<User> findByEmailIn(List<String> emails);
    List<User> findByPhoneIn(List<String> phones);

    // --- Batch-safe fetch for syncPasswordsWithMasterAdmin ---
    @Query("SELECT u FROM User u WHERE u.role.name NOT IN :roleNames")
    List<User> findByRole_NameNotInWithPaging(List<String> roleNames, Pageable pageable);
}
