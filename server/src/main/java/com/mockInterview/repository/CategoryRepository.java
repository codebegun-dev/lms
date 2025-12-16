package com.mockInterview.repository;

import com.mockInterview.entity.Category;
import com.mockInterview.entity.Status;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

	boolean existsByName(String name);

	List<Category> findAllByOrderByStatusAsc();

	List<Category> findByStatus(Status status);

}
