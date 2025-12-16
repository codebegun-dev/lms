package com.mockInterview.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ================= BASIC LOOKUPS =================
    User findByEmail(String email);
    User findByPhone(String phone);
    User findByEmailOrPhone(String email, String phone);
    boolean existsByEmail(String email);

    // ================= ROLE BASED =================
    User findByRole_Name(String roleName);
    List<User> findByRole(Role role);
    List<User> findByRole_NameNot(String roleName);
    List<User> findByRoleInAndStatus(List<Role> roles, String status);

    // ================= STATUS + PAGINATION =================
    Page<User> findByStatusAndRole_NameNot(
            String status,
            String roleName,
            Pageable pageable
    );

    // ================= COUNTS =================
    long countByRole_NameNot(String roleName);
    long countByStatusAndRole_NameNot(String status, String roleName);
    
 // ================= ROLE-WISE COUNTS (EXCLUDE MASTER_ADMIN) =================
    @Query("""
        SELECT r.name, COUNT(u)
        FROM User u
        JOIN u.role r
        WHERE r.name <> 'MASTER_ADMIN'
        GROUP BY r.name
    """)
    List<Object[]> findRoleWiseCountsExcludingMasterAdmin();

}
