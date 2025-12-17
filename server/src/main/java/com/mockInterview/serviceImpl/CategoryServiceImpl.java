package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Category;
import com.mockInterview.entity.Status;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.InactiveResourceException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.CategoryRepository;
import com.mockInterview.responseDtos.CategoryDto;
import com.mockInterview.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // ✅ Add Category
    @Override
    public CategoryDto addCategory(CategoryDto dto) {
        // Optional: check duplicate name
        if (categoryRepository.existsByName(dto.getName())) {
            throw new DuplicateFieldException("Category name already exists");
        }

        Category category = new Category();
        category.setName(dto.getName());
        Category savedCategory = categoryRepository.save(category);
        return convertToDto(savedCategory);
    }

    // ✅ Update Category (cannot update if INACTIVE)
    @Override
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (category.getStatus() == Status.INACTIVE) {
            throw new InactiveResourceException("Inactive category cannot be updated");
        }

        // Check duplicate name excluding self
        if (!category.getName().equalsIgnoreCase(dto.getName()) && categoryRepository.existsByName(dto.getName())) {
            throw new DuplicateFieldException("Category name already exists");
        }

        category.setName(dto.getName());
        Category updatedCategory = categoryRepository.save(category);
        return convertToDto(updatedCategory);
    }

    // ✅ Update Category Status (ACTIVE / INACTIVE)
    @Override
    public CategoryDto updateCategoryStatus(Long id, Status status) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setStatus(status);
        Category updatedCategory = categoryRepository.save(category);
        return convertToDto(updatedCategory);
    }

    // ✅ Get Category by ID
    @Override
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return convertToDto(category);
    }

    // ✅ Get All Categories (ACTIVE first, then INACTIVE)
    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAllByOrderByStatusAsc();
        List<CategoryDto> dtoList = new ArrayList<>();

        for (Category c : categories) {
            dtoList.add(convertToDto(c));
        }
        return dtoList;
    }

    // ✅ Get Only ACTIVE Categories
    @Override
    public List<CategoryDto> getActiveCategories() {
        List<Category> categories = categoryRepository.findByStatus(Status.ACTIVE);
        List<CategoryDto> dtoList = new ArrayList<>();
        for (Category c : categories) {
            dtoList.add(convertToDto(c));
        }
        return dtoList;
    }

    // ✅ Delete Category
    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    // ✅ Helper: Convert Entity → DTO
    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setStatus(category.getStatus()); // include status in DTO
        return dto;
    }
}
