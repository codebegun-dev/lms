package com.mockInterview.responseDtos;

import lombok.*;


import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponseDto {
    private Long id;
    private String name;
    private String description;
    private Set<String> permissions;
}