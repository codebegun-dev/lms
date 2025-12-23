package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.mockInterview.entity.Status;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponseDto {

    private Long roleId;
    private String roleName;
    private Status status;
    private String description;

    private List<ModulePermissionResponseDto> modules;
}
