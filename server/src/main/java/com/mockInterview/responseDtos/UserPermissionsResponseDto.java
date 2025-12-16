
package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPermissionsResponseDto {
    private Long userId;
    private String email;
    private String role;
    private List<ModulePermissionDto> modules;
}
