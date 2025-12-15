package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponseDto {

    private Long roleId;
    private String roleName;
    private String description;

    private List<ModulePermissionResponseDto> modules;
}
