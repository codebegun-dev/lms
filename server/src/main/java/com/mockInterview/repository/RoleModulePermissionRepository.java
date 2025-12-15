package com.mockInterview.repository;

import com.mockInterview.entity.Role;
import com.mockInterview.entity.Module;
import com.mockInterview.entity.RoleModulePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleModulePermissionRepository
        extends JpaRepository<RoleModulePermission, Long> {

    List<RoleModulePermission> findByRole(Role role);

    List<RoleModulePermission> findByRoleId(Long roleId);

    List<RoleModulePermission> findByModule(Module module);

    void deleteByRole(Role role);
}
