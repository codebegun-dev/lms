// ModulePermissionDto.java
package com.mockInterview.responseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModulePermissionDto {
    private String module;
    private List<String> permissions;
}
