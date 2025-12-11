package com.mockInterview.requestDtos;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleRequestDto {
    private String name;
    private String description;
    private Set<Long> permissionIds; // assign permissions by ID
}