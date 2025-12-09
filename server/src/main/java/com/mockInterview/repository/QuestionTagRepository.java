package com.mockInterview.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.QuestionTag;

import java.util.List;

@Repository
public interface QuestionTagRepository extends JpaRepository<QuestionTag, Long> {
    List<QuestionTag> findByQuestionQuestionId(Long questionId);
}
