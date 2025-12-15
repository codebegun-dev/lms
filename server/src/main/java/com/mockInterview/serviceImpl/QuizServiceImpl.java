package com.mockInterview.serviceImpl;

import com.mockInterview.entity.Quiz;
import com.mockInterview.entity.Topic;
import com.mockInterview.entity.SubTopic;
import com.mockInterview.mapper.QuizMapper;
import com.mockInterview.repository.QuizRepository;
import com.mockInterview.repository.TopicRepository;
import com.mockInterview.repository.SubTopicRepository;
import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;
import com.mockInterview.service.QuizService;
import com.mockInterview.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubTopicRepository subTopicRepository;

    // ================= CREATE =================
    @Override
    public QuizResponseDto createQuiz(QuizRequestDto dto) {

        Topic topic = topicRepository.findById(dto.getTopicId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));

        SubTopic subTopic = null;
        if (dto.getSubTopicId() != null) {
            subTopic = subTopicRepository.findById(dto.getSubTopicId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("SubTopic not found with id: " + dto.getSubTopicId()));
        }

        Quiz quiz = QuizMapper.toEntity(dto, topic, subTopic);

        Quiz savedQuiz = quizRepository.save(quiz);

        return QuizMapper.toResponseDto(savedQuiz);
    }

    // ================= READ (BY ID) =================
    @Override
    @Transactional(readOnly = true)
    public QuizResponseDto getQuizById(Long quizId) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Quiz not found with id: " + quizId));

        return QuizMapper.toResponseDto(quiz);
    }

    // ================= READ (ALL) =================
    @Override
    @Transactional(readOnly = true)
    public List<QuizResponseDto> getAllQuizzes() {

        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizResponseDto> responseList = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            responseList.add(QuizMapper.toResponseDto(quiz));
        }

        return responseList;
    }

    // ================= UPDATE =================
    @Override
    public QuizResponseDto updateQuiz(Long quizId, QuizRequestDto dto) {

        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Quiz not found with id: " + quizId));

        Topic topic = topicRepository.findById(dto.getTopicId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));

        SubTopic subTopic = null;
        if (dto.getSubTopicId() != null) {
            subTopic = subTopicRepository.findById(dto.getSubTopicId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("SubTopic not found with id: " + dto.getSubTopicId()));
        }

        // update fields
        existingQuiz.setTitle(dto.getTitle());
        existingQuiz.setDescription(dto.getDescription());
        existingQuiz.setTimeLimit(dto.getTimeLimit());
        existingQuiz.setTotalMarks(dto.getTotalMarks());

        existingQuiz.setTopic(topic);
        existingQuiz.setSubTopic(subTopic);

        existingQuiz.setQuizType(dto.getQuizType());
        existingQuiz.setShowResults(dto.getShowResults());

        existingQuiz.setEnableTabSwitchRestriction(dto.getEnableTabSwitchRestriction());
        existingQuiz.setMaxTabSwitchAttempts(dto.getMaxTabSwitchAttempts());
        existingQuiz.setEnableCamera(dto.getEnableCamera());
        existingQuiz.setEnableRecording(dto.getEnableRecording());

        existingQuiz.setRestrictedEmails(dto.getRestrictedEmails());

        Quiz updatedQuiz = quizRepository.save(existingQuiz);

        return QuizMapper.toResponseDto(updatedQuiz);
    }

    // ================= DELETE =================
    @Override
    public void deleteQuiz(Long quizId) {

        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }

        quizRepository.deleteById(quizId);
    }
}   