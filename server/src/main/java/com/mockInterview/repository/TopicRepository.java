package com.mockInterview.repository;



import com.mockInterview.entity.Category;
import com.mockInterview.entity.Status;
import com.mockInterview.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
	boolean existsByNameAndCategory(String name, Category category);

	boolean existsByNameAndCategoryAndIdNot(String name, Category category, Long id);

	List<Topic> findByStatus(Status status);

	List<Topic> findByCategory(Category category);

}

