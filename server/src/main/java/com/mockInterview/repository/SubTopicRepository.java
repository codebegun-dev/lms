package com.mockInterview.repository;

import com.mockInterview.entity.SubTopic;
import com.mockInterview.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubTopicRepository extends JpaRepository<SubTopic, Long> {
    List<SubTopic> findByTopic(Topic topic);
}
