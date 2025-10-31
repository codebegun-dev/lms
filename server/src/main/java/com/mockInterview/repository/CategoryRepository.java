package com.mockInterview.repository;

import com.mockInterview.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by name
    Category findByName(String name);
}
