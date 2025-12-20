

package com.mockInterview.repository;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.Status;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String name);

    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
    List<Role> findByStatus(Status status);
}

