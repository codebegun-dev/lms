package com.mockInterview.repository;



import com.mockInterview.entity.Category;
import com.mockInterview.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByCategory(Category category);
}

