package com.mockInterview.repository;

import com.mockInterview.entity.Category;
import com.mockInterview.entity.QuestionBank;
import com.mockInterview.entity.SubTopic;
import com.mockInterview.entity.Topic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface QuestionBankRepository extends JpaRepository<QuestionBank, Long> {

    // Find questions by Category
    List<QuestionBank> findByCategory(Category category);

    // Find questions by Topic
    List<QuestionBank> findByTopic(Topic topic);

    // Find questions by SubTopic
    List<QuestionBank> findBySubTopic(SubTopic subTopic);

    // Find by Difficulty
    List<QuestionBank> findByDifficultyIgnoreCase(String difficulty);

    // Find by Title (partial match)
    List<QuestionBank> findByTitleContainingIgnoreCase(String title);
    
    
 // ✅ Get all questions by Category ID
    List<QuestionBank> findByCategory_Id(Long categoryId);

    // ✅ Get random questions by Category ID (LIMIT via Pageable)
    @Query("SELECT q FROM QuestionBank q WHERE q.category.id = :categoryId ORDER BY function('RAND')")
    List<QuestionBank> findRandomQuestionsByCategory(Long categoryId, Pageable pageable);
}
