package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Quiz;
import com.mockInterview.entity.QuizQuestions;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.QuizQuestionsRepository;
import com.mockInterview.repository.QuizRepository;
import com.mockInterview.requestDtos.QuestionRequestDto;
import com.mockInterview.responseDtos.QuestionResponseDto;
import com.mockInterview.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuizQuestionsRepository questionRepository;

    @Autowired
    private QuizRepository quizRepository;

    // ---------------- CREATE ----------------
    @Override
    public QuestionResponseDto createQuestion(QuestionRequestDto questionRequestDto) {
        // Verify quiz exists
        Optional<Quiz> quizOptional = quizRepository.findById(questionRequestDto.getQuizId());
        if (!quizOptional.isPresent()) {
            throw new ResourceNotFoundException("Quiz not found with id: " + questionRequestDto.getQuizId());
        }

        QuizQuestions question = QuizQuestions.builder()
                .questionText(questionRequestDto.getQuestionText())
                .questionType(questionRequestDto.getQuestionType())
                .difficulty(questionRequestDto.getDifficulty())
                .topic(questionRequestDto.getTopic())
                .explanation(questionRequestDto.getExplanation())
                .maxMarks(questionRequestDto.getMaxMarks())
                .version(1)
                .createdBy(questionRequestDto.getCreatedBy())
                .quiz(quizOptional.get()) // no cast needed
                .build();

        QuizQuestions savedQuestion = questionRepository.save(question);
        return mapToResponseDto(savedQuestion);
    }

    // ---------------- UPDATE ----------------
    @Override
    public QuestionResponseDto updateQuestion(Long questionId, QuestionRequestDto questionRequestDto) {
        Optional<QuizQuestions> optionalQuestion = questionRepository.findById(questionId);
        if (!optionalQuestion.isPresent()) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }

        QuizQuestions question = optionalQuestion.get();
        question.setQuestionText(questionRequestDto.getQuestionText());
        question.setQuestionType(questionRequestDto.getQuestionType());
        question.setDifficulty(questionRequestDto.getDifficulty());
        question.setTopic(questionRequestDto.getTopic());
        question.setExplanation(questionRequestDto.getExplanation());
        question.setMaxMarks(questionRequestDto.getMaxMarks());
        question.setUpdatedBy(questionRequestDto.getUpdatedBy());

        QuizQuestions updatedQuestion = questionRepository.save(question);
        return mapToResponseDto(updatedQuestion);
    }

    // ---------------- GET BY ID ----------------
    @Override
    public QuestionResponseDto getQuestionById(Long questionId) {
        Optional<QuizQuestions> optionalQuestion = questionRepository.findById(questionId);
        if (!optionalQuestion.isPresent()) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }
        return mapToResponseDto(optionalQuestion.get());
    }

    // ---------------- GET ALL ----------------
    @Override
    public List<QuestionResponseDto> getAllQuestions() {
        List<QuizQuestions> questions = questionRepository.findAll();
        List<QuestionResponseDto> responseList = new ArrayList<QuestionResponseDto>();
        for (QuizQuestions question : questions) {
            responseList.add(mapToResponseDto(question));
        }
        return responseList;
    }

    // ---------------- GET BY QUIZ ----------------
    @Override
    public List<QuestionResponseDto> getQuestionsByQuizId(Long quizId) {
        List<QuizQuestions> questions = questionRepository.findByQuiz_QuizId(quizId);
        List<QuestionResponseDto> responseList = new ArrayList<QuestionResponseDto>();
        for (QuizQuestions question : questions) {
            responseList.add(mapToResponseDto(question));
        }
        return responseList;
    }

    // ---------------- DELETE ----------------
    @Override
    public void deleteQuestion(Long questionId) {
        Optional<QuizQuestions> optionalQuestion = questionRepository.findById(questionId);
        if (!optionalQuestion.isPresent()) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }
        questionRepository.delete(optionalQuestion.get());
    }

    // ---------------- UTILITY ----------------
    private QuestionResponseDto mapToResponseDto(QuizQuestions question) {
        return QuestionResponseDto.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType())
                .difficulty(question.getDifficulty())
                .topic(question.getTopic())
                .explanation(question.getExplanation())
                .maxMarks(question.getMaxMarks())
                .version(question.getVersion())
                .quizId(question.getQuiz().getQuizId())
                .createdBy(question.getCreatedBy())
                .updatedBy(question.getUpdatedBy())
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
}
