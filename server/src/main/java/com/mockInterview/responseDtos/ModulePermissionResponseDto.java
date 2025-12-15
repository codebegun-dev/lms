package com.mockInterview.responseDtos;

import lombok.Data;
import java.util.List;

@Data
public class ModulePermissionResponseDto {

    private Long moduleId;
    private String moduleName;

    private List<PermissionResponseDto> permissions;
}
