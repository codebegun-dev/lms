package com.mockInterview.controller;

import com.mockInterview.responseDtos.CategoryDto;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.CategoryService;


import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@ModulePermission("CATEGORY_MANAGEMENT")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ✅ Create Category
    @PreAuthorize("hasAuthority('CREATE_CATEGORY')")
    @PostMapping
    public CategoryDto addCategory(@Valid @RequestBody CategoryDto dto) {
        return categoryService.addCategory(dto);
    }

    // ✅ Get All Categories
    @PreAuthorize("hasAuthority('VIEW_CATEGORY')")
    @GetMapping
    public List<CategoryDto> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // ✅ Update Category
    @PreAuthorize("hasAuthority('UPDATE_CATEGORY')")
    @PutMapping("/{id}")
    public CategoryDto updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto dto) {

        return categoryService.updateCategory(id, dto);
    }

    // ✅ Delete Category
    @PreAuthorize("hasAuthority('DELETE_CATEGORY')")
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
}
