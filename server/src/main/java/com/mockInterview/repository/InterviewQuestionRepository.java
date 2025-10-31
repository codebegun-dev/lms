package com.mockInterview.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mockInterview.entity.InterviewQuestion;

import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {

    // Fetch all questions assigned for an interview
    List<InterviewQuestion> findByInterviewIdOrderByAskedOrderAsc(Long interviewId);

    // To get the next question number for this interview (max order)
    InterviewQuestion findTopByInterviewIdOrderByAskedOrderDesc(Long interviewId);
}
