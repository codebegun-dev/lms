package com.mockInterview.responseDtos;


import com.mockInterview.entity.Status;

import lombok.Data;

@Data
public class CategoryDto {
    private Long id;
    private String name;
    private Status status; // ✅ Add this field
}
