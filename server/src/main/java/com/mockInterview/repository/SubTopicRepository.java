package com.mockInterview.repository;

import com.mockInterview.entity.SubTopic;
import com.mockInterview.entity.Topic;
import com.mockInterview.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubTopicRepository extends JpaRepository<SubTopic, Long> {

    
    List<SubTopic> findByTopic(Topic topic);

    
    boolean existsByNameAndTopic(String name, Topic topic);

    
    boolean existsByNameAndTopicAndIdNot(String name, Topic topic, Long id);

 
    List<SubTopic> findByStatus(Status status);

    
    List<SubTopic> findByTopicAndStatus(Topic topic, Status status);
}
