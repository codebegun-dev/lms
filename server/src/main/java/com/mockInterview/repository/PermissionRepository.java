package com.mockInterview.repository;

import com.mockInterview.entity.Module;
import com.mockInterview.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Permission findByName(String name);

    List<Permission> findByModule(Module module);

    List<Permission> findByModuleId(Long moduleId);
}
