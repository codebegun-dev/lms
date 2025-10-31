package com.mockInterview.service;


import java.util.List;

import com.mockInterview.responseDtos.CategoryDto;

public interface CategoryService {
    CategoryDto addCategory(CategoryDto dto);
    CategoryDto updateCategory(Long id, CategoryDto dto);
    CategoryDto getCategoryById(Long id);
    List<CategoryDto> getAllCategories();
    void deleteCategory(Long id);
}
