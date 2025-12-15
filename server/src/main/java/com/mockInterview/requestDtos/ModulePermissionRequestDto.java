package com.mockInterview.requestDtos;

import lombok.Data;
import java.util.List;

@Data
public class ModulePermissionRequestDto {

    private Long moduleId;

    // Selected permission IDs for this module
    private List<Long> permissionIds;
}
