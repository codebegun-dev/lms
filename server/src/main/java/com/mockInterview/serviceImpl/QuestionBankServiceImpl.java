package com.mockInterview.serviceImpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mockInterview.entity.*;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.*;
import com.mockInterview.requestDtos.QuestionBankDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.responseDtos.QuestionCategoryCountDto;
import com.mockInterview.service.QuestionBankService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class QuestionBankServiceImpl implements QuestionBankService {

    @Autowired
    private QuestionBankRepository questionBankRepository;

    @Autowired
    private CategoryRepository categoryRepository;
  
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubTopicRepository subTopicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionStatsRepository questionStatsRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ Add Question
    @Override
    public QuestionBankResponseDto addQuestion(QuestionBankDto dto) {
        // ✅ Category & Topic are mandatory
        if (dto.getCategoryId() == null || dto.getTopicId() == null) {
            throw new IllegalArgumentException("Category and Topic IDs must not be null.");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Topic topic = topicRepository.findById(dto.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));

        // ✅ SubTopic is optional
        SubTopic subTopic = null;
        if (dto.getSubTopicId() != null) {
            subTopic = subTopicRepository.findById(dto.getSubTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + dto.getSubTopicId()));
        }

        QuestionBank question = new QuestionBank();
        question.setTitle(dto.getTitle());
        question.setDifficulty(dto.getDifficulty());
        question.setCategory(category);
        question.setTopic(topic);
        question.setSubTopic(subTopic); // may be null
        question.setCreatedDate(LocalDate.now());

        if (dto.getCreatedByUserId() != null) {
            User user = userRepository.findById(dto.getCreatedByUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getCreatedByUserId()));
            question.setCreatedBy(user);
        }

        QuestionBank savedQuestion = questionBankRepository.save(question);

        // ✅ Auto-update category counts
        getQuestionCountsByCategory();

        return convertToResponseDto(savedQuestion);
    }

    // ✅ Update Question
    @Override
    public QuestionBankResponseDto updateQuestion(Long id, QuestionBankDto dto) {
        QuestionBank question = questionBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        if (dto.getTitle() != null) question.setTitle(dto.getTitle());
        if (dto.getDifficulty() != null) question.setDifficulty(dto.getDifficulty());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            question.setCategory(category);
        }

        if (dto.getTopicId() != null) {
            Topic topic = topicRepository.findById(dto.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + dto.getTopicId()));
            question.setTopic(topic);
        }

        if (dto.getSubTopicId() != null) {
            SubTopic subTopic = subTopicRepository.findById(dto.getSubTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + dto.getSubTopicId()));
            question.setSubTopic(subTopic);
        } else {
            question.setSubTopic(null); // ✅ allows removing subtopic
        }


        if (dto.getCreatedByUserId() != null) {
            User user = userRepository.findById(dto.getCreatedByUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getCreatedByUserId()));
            question.setCreatedBy(user);
        }

        QuestionBank updatedQuestion = questionBankRepository.save(question);

        // ✅ Auto-update category counts
        getQuestionCountsByCategory();

        return convertToResponseDto(updatedQuestion);
    }

    // ✅ Get Question by ID
    @Override
    public QuestionBankResponseDto getQuestionById(Long id) {
        QuestionBank question = questionBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return convertToResponseDto(question);
    }

    // ✅ Get All Questions
    @Override
    public List<QuestionBankResponseDto> getAllQuestions() {
        List<QuestionBank> questions = questionBankRepository.findAll();
        return convertListToResponse(questions);
    }

    // ✅ Get Questions by SubTopic ID
    @Override
    public List<QuestionBankResponseDto> getQuestionsBySubTopicId(Long subTopicId) {
        SubTopic subTopic = subTopicRepository.findById(subTopicId)
                .orElseThrow(() -> new ResourceNotFoundException("SubTopic not found with id: " + subTopicId));
        List<QuestionBank> questions = questionBankRepository.findBySubTopic(subTopic);
        return convertListToResponse(questions);
    }

    // ✅ Search by IDs
    @Override
    public List<QuestionBankResponseDto> searchQuestions(Long categoryId, Long topicId, Long subTopicId, String difficulty, String title) {
        List<QuestionBank> allQuestions = questionBankRepository.findAll();
        List<QuestionBankResponseDto> result = new ArrayList<>();

        for (QuestionBank q : allQuestions) {
            boolean matches = true;
            if (categoryId != null && (q.getCategory() == null || !q.getCategory().getId().equals(categoryId))) matches = false;
            if (topicId != null && (q.getTopic() == null || !q.getTopic().getId().equals(topicId))) matches = false;
            if (subTopicId != null && (q.getSubTopic() == null || !q.getSubTopic().getId().equals(subTopicId))) matches = false;
            if (difficulty != null && (q.getDifficulty() == null || !q.getDifficulty().equalsIgnoreCase(difficulty))) matches = false;
            if (title != null && (q.getTitle() == null || !q.getTitle().toLowerCase().contains(title.toLowerCase()))) matches = false;

            if (matches) result.add(convertToResponseDto(q));
        }
        return result;
    }

    // ✅ Filter by Names
    @Override
    public List<QuestionBankResponseDto> getQuestionsByFilters(String category, String topic, String subTopic, String difficulty, String title) {
        List<QuestionBank> allQuestions = questionBankRepository.findAll();
        List<QuestionBankResponseDto> result = new ArrayList<>();

        for (QuestionBank q : allQuestions) {
            boolean matches = true;
            if (category != null && (q.getCategory() == null || !q.getCategory().getName().equalsIgnoreCase(category))) matches = false;
            if (topic != null && (q.getTopic() == null || !q.getTopic().getName().equalsIgnoreCase(topic))) matches = false;
            if (subTopic != null && (q.getSubTopic() == null || !q.getSubTopic().getName().equalsIgnoreCase(subTopic))) matches = false;
            if (difficulty != null && (q.getDifficulty() == null || !q.getDifficulty().equalsIgnoreCase(difficulty))) matches = false;
            if (title != null && (q.getTitle() == null || !q.getTitle().toLowerCase().contains(title.toLowerCase()))) matches = false;

            if (matches) result.add(convertToResponseDto(q));
        }
        return result;
    }

    // ✅ Delete Question
    @Override
    public void deleteQuestion(Long id) {
        QuestionBank question = questionBankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        questionBankRepository.delete(question);

        // ✅ Auto-update category counts
        getQuestionCountsByCategory();
    }

    // ✅ Count Questions by Category (Dynamic)
    @Override
    public QuestionCategoryCountDto getQuestionCountsByCategory() {
        List<QuestionBank> allQuestions = questionBankRepository.findAll();

        long totalQuestions = allQuestions.size();
        Map<String, Long> categoryWiseCount = new HashMap<>();

        for (QuestionBank q : allQuestions) {
            if (q.getCategory() != null && q.getCategory().getName() != null) {
                String categoryName = q.getCategory().getName();
                categoryWiseCount.put(categoryName, categoryWiseCount.getOrDefault(categoryName, 0L) + 1);
            }
        }

        QuestionCategoryCountDto dto = new QuestionCategoryCountDto();
        dto.setTotalQuestions(totalQuestions);
        dto.setCategoryWiseCount(categoryWiseCount);

        saveQuestionStats(dto);
        return dto;
    }

    // ✅ Save Stats in DB
    private void saveQuestionStats(QuestionCategoryCountDto dto) {
        try {
            QuestionStats stats = questionStatsRepository.findAll().stream()
                    .findFirst()
                    .orElse(new QuestionStats());

            stats.setTotalQuestions(dto.getTotalQuestions());
            stats.setSetCategoryCountsJson(objectMapper.writeValueAsString(dto.getCategoryWiseCount()));

            questionStatsRepository.save(stats);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting category counts to JSON", e);
        }
    }

    // ✅ Convert Entity → DTO
    private QuestionBankResponseDto convertToResponseDto(QuestionBank question) {
        QuestionBankResponseDto dto = new QuestionBankResponseDto();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setDifficulty(question.getDifficulty());

        dto.setCategoryName(question.getCategory() != null ? question.getCategory().getName() : null);
        dto.setTopicName(question.getTopic() != null ? question.getTopic().getName() : null);
        dto.setSubTopicName(question.getSubTopic() != null ? question.getSubTopic().getName() : null);
        dto.setCreatedDate(question.getCreatedDate());

        if (question.getCreatedBy() != null) {
            dto.setCreatedBy(
                    question.getCreatedBy().getFirstName() +
                            (question.getCreatedBy().getLastName() != null
                                    ? " " + question.getCreatedBy().getLastName()
                                    : "")
            );
        } else {
            dto.setCreatedBy("Unknown");
        }

        return dto;
    }

    // ✅ Convert List<Entity> → List<DTO>
    private List<QuestionBankResponseDto> convertListToResponse(List<QuestionBank> list) {
        List<QuestionBankResponseDto> dtoList = new ArrayList<>();
        for (QuestionBank q : list) {
            dtoList.add(convertToResponseDto(q));
        }
        return dtoList;
    }
    
    
    @Override
    public List<QuestionBankResponseDto> getRandomQuestionsByCategory(Long categoryId) {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID must not be null.");
        }

        // ✅ Fetch all questions by category
        List<QuestionBank> questions = questionBankRepository.findByCategory_Id(categoryId);

        if (questions.isEmpty()) {
            throw new ResourceNotFoundException("No questions found for category ID: " + categoryId);
        }

        // ✅ Optional: Shuffle questions randomly
        Collections.shuffle(questions);

        // ✅ Convert to DTO list
        List<QuestionBankResponseDto> responseList = new ArrayList<>();
        for (QuestionBank q : questions) {
            QuestionBankResponseDto dto = new QuestionBankResponseDto();
            dto.setId(q.getId());
            dto.setTitle(q.getTitle());
            dto.setDifficulty(q.getDifficulty());
            dto.setCategoryName(q.getCategory().getName());
            dto.setTopicName(q.getTopic() != null ? q.getTopic().getName() : null);
            dto.setSubTopicName(q.getSubTopic() != null ? q.getSubTopic().getName() : null);

            if (q.getCreatedBy() != null) {
                String fullName = q.getCreatedBy().getFirstName();
                if (q.getCreatedBy().getLastName() != null) {
                    fullName += " " + q.getCreatedBy().getLastName();
                }
                dto.setCreatedBy(fullName);
            } else {
                dto.setCreatedBy("Unknown");
            }

            dto.setCreatedDate(q.getCreatedDate());
            responseList.add(dto);
        }

        return responseList;
    }

}
