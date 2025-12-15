package com.mockInterview.requestDtos;

import lombok.Data;
import java.util.List;

@Data
public class RoleRequestDto {

    private String roleName;
    private String description;

    // module-wise permissions
    private List<ModulePermissionRequestDto> modules;
}
