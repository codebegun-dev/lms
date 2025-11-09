package com.mockInterview.responseDtos;

import lombok.Data;
import java.util.List;

@Data
public class RoleResponseDto {
    private Long id;
    private String name;
    private List<String> permissions;
}
