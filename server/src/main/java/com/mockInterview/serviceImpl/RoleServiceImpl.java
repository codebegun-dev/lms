package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Module;
import com.mockInterview.entity.Permission;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.RoleModulePermission;
import com.mockInterview.entity.Status;
import com.mockInterview.entity.User;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.ModuleRepository;
import com.mockInterview.repository.PermissionRepository;
import com.mockInterview.repository.RoleModulePermissionRepository;
import com.mockInterview.repository.RoleRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.ModulePermissionRequestDto;
import com.mockInterview.requestDtos.RoleRequestDto;
import com.mockInterview.responseDtos.ModulePermissionResponseDto;
import com.mockInterview.responseDtos.PermissionResponseDto;
import com.mockInterview.responseDtos.RoleResponseDto;
import com.mockInterview.security.SecurityUtils;
import com.mockInterview.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private PermissionRepository permissionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleModulePermissionRepository roleModulePermissionRepository;

    // ================= CREATE ROLE =================
    @Override
    public RoleResponseDto createRole(RoleRequestDto dto) {
    	
    	if (roleRepository.existsByName(dto.getRoleName())) {
            throw new DuplicateFieldException("Role name already exists");
        }

        Role role = new Role();
        role.setName(dto.getRoleName());
        role.setDescription(dto.getDescription());
        role.setStatus(Status.ACTIVE);

        role.setCreatedBy(SecurityUtils.getCurrentUserId());

        role = roleRepository.save(role);

        Set<RoleModulePermission> mappingSet = new HashSet<>();

        if (dto.getModules() != null) {
            for (ModulePermissionRequestDto mDto : dto.getModules()) {

                Module module = moduleRepository.findById(mDto.getModuleId())
                        .orElseThrow(() -> new ResourceNotFoundException("Module not found"));

                for (Long permId : mDto.getPermissionIds()) {
                    Permission permission = permissionRepository.findById(permId)
                            .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

                    RoleModulePermission rmp = new RoleModulePermission();
                    rmp.setRole(role);
                    rmp.setModule(module);
                    rmp.setPermission(permission);

                    mappingSet.add(rmp);
                }
            }
        }

        roleModulePermissionRepository.saveAll(mappingSet);
        role.setModulePermissions(mappingSet);

        return mapToDto(role);
    }

    @Override
    public RoleResponseDto updateRole(Long roleId, RoleRequestDto dto) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // ❌ Inactive role cannot be edited
        if (role.getStatus() == Status.INACTIVE) {
            throw new ResourceNotFoundException("Inactive role cannot be edited");
        }

        // ❌ MASTER_ADMIN / DEFAULT fully protected
        if (isProtectedRole(role.getName())) {
            throw new ResourceNotFoundException(role.getName() + " role cannot be updated");
        }

        // ❌ STUDENT name cannot be changed
        if (isStudentRole(role.getName())) {
            role.setDescription(dto.getDescription()); // optional
        } else {
            // Duplicate check only if name is editable
            boolean exists = roleRepository.existsByNameAndIdNot(dto.getRoleName(), roleId);
            if (exists) {
                throw new ResourceNotFoundException("Role name already exists");
            }
            role.setName(dto.getRoleName());
            role.setDescription(dto.getDescription());
        }

        // ✅ STUDENT is allowed to add/update permissions
        if (dto.getModules() != null) {

            role.getModulePermissions().clear();

            for (ModulePermissionRequestDto mDto : dto.getModules()) {

                Module module = moduleRepository.findById(mDto.getModuleId())
                        .orElseThrow(() -> new ResourceNotFoundException("Module not found"));

                for (Long permId : mDto.getPermissionIds()) {
                    Permission permission = permissionRepository.findById(permId)
                            .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

                    RoleModulePermission rmp = new RoleModulePermission();
                    rmp.setRole(role);
                    rmp.setModule(module);
                    rmp.setPermission(permission);

                    role.getModulePermissions().add(rmp);
                }
            }
        }

        return mapToDto(roleRepository.save(role));
    }


    // ================= GET ROLE =================
    @Override
    public RoleResponseDto getRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return mapToDto(role);
    }

    @Override
    public List<RoleResponseDto> getAllRoles() {

        List<RoleResponseDto> list = new ArrayList<>();

        List<Role> active = roleRepository.findByStatus(Status.ACTIVE);
        List<Role> inactive = roleRepository.findByStatus(Status.INACTIVE);

        for (Role r : active) list.add(mapToDto(r));
        for (Role r : inactive) list.add(mapToDto(r));

        return list;
    }
    
    @Override
    public List<RoleResponseDto> getActiveRoles() {

        List<RoleResponseDto> responseList = new ArrayList<>();

        List<Role> activeRoles = roleRepository.findByStatus(Status.ACTIVE);

        for (Role role : activeRoles) {
            responseList.add(mapToDto(role));
        }

        return responseList;
    }



    @Override
    public void deleteRole(Long roleId) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        // ❌ Protected roles
        if (isProtectedRole(role.getName()) || isStudentRole(role.getName())) {
            throw new ResourceNotFoundException(role.getName() + " role cannot be deleted");
        }

        // ✅ Get DEFAULT role
        Role defaultRole = roleRepository.findByName("DEFAULT");
        if (defaultRole == null) {
            throw new ResourceNotFoundException("DEFAULT role not found");
        }

        // ✅ Find users with this role
        List<User> usersWithRole = userRepository.findByRole(role);

        // ✅ Reassign users to DEFAULT role
        for (User user : usersWithRole) {
            user.setRole(defaultRole);
        }

        userRepository.saveAll(usersWithRole);

        // ✅ Delete role safely
        roleRepository.delete(role);
    }


    
    @Override
    public void changeRoleStatus(Long roleId, Status status) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        // ❌ Protected roles (cannot be activated/deactivated)
        if (isProtectedRole(role.getName()) || isStudentRole(role.getName())) {
            throw new ResourceNotFoundException(role.getName() + " role status cannot be changed");
        }

        // ❌ Prevent unnecessary update
        if (role.getStatus() == status) {
            throw new ResourceNotFoundException("Role is already " + status);
        }

        role.setStatus(status);
        roleRepository.save(role);
    }



    // ================= DTO MAPPER =================
    private RoleResponseDto mapToDto(Role role) {

        Map<Long, ModulePermissionResponseDto> moduleMap = new HashMap<>();

        if (role.getModulePermissions() != null) {
            for (RoleModulePermission rmp : role.getModulePermissions()) {

                Long moduleId = rmp.getModule().getId();

                ModulePermissionResponseDto mp = moduleMap.get(moduleId);
                if (mp == null) {
                    mp = new ModulePermissionResponseDto();
                    mp.setModuleId(moduleId);
                    mp.setModuleName(rmp.getModule().getName());
                    mp.setPermissions(new ArrayList<>());
                    moduleMap.put(moduleId, mp);
                }

                // Wrap permission into DTO
                PermissionResponseDto permDto = new PermissionResponseDto();
                permDto.setId(rmp.getPermission().getId());
                permDto.setName(rmp.getPermission().getName());

                mp.getPermissions().add(permDto);
            }
        }

        RoleResponseDto response = new RoleResponseDto();
        response.setRoleId(role.getId());
        response.setRoleName(role.getName());
        response.setStatus(role.getStatus());
        response.setDescription(role.getDescription());
        response.setModules(new ArrayList<>(moduleMap.values()));

        return response;
    }
    
    
    private boolean isProtectedRole(String roleName) {
        return roleName.equalsIgnoreCase("MASTER_ADMIN");
            
    }

    private boolean isStudentRole(String roleName) {
        return roleName.equalsIgnoreCase("STUDENT") || 
        		roleName.equalsIgnoreCase("MASTER_ADMIN") 
        		||roleName.equalsIgnoreCase("DEFAULT");
    }

}
