package com.mockInterview.service;

import java.util.List;

import com.mockInterview.entity.Status;
import com.mockInterview.responseDtos.CategoryDto;

public interface CategoryService {

    CategoryDto addCategory(CategoryDto dto);

    CategoryDto updateCategory(Long id, CategoryDto dto);

    // 🔹 Update category status (ACTIVE / INACTIVE)
    CategoryDto updateCategoryStatus(Long id, Status status);

    CategoryDto getCategoryById(Long id);

    List<CategoryDto> getAllCategories();

    // 🔹 Get only ACTIVE categories
    List<CategoryDto> getActiveCategories();

    void deleteCategory(Long id);
}
