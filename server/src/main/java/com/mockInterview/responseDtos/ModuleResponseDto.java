package com.mockInterview.responseDtos;

import lombok.Data;
import java.util.List;

@Data
public class ModuleResponseDto {

    private Long id;
    private String name;
    private String description;

    // permissions shown only in UI (not auto-linked)
    private List<PermissionResponseDto> permissions;
}
