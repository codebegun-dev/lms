package com.mockInterview.requestDtos;

import lombok.Data;
import java.util.List;

@Data
public class RoleRequestDto {
    private String name;
    private List<String> permissions;
}
