package com.mockInterview.serviceImpl;

import com.mockInterview.entity.QuestionBank;
import com.mockInterview.entity.Role;
import com.mockInterview.entity.User;
import com.mockInterview.repository.QuestionBankRepository;
import com.mockInterview.repository.UserRepository;
import com.mockInterview.requestDtos.QuestionBankDto;
import com.mockInterview.responseDtos.QuestionBankResponseDto;
import com.mockInterview.service.QuestionBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionBankServiceImpl implements QuestionBankService {

    @Autowired
    private QuestionBankRepository questionBankRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public QuestionBankResponseDto addQuestion(QuestionBankDto dto) {
        User admin = userRepository.findById(dto.getAdminId())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("User is not admin");
        }

        QuestionBank question = QuestionBank.builder()
                .category(dto.getCategory())
                .difficulty(dto.getDifficulty())
                .title(dto.getTitle())
                .topic(dto.getTopic())
                .createdBy(admin.getFirstName() + " " + admin.getLastName())
                .createdDate(LocalDate.now())
                .build();

        return mapToDto(questionBankRepository.save(question));
    }

    @Override
    public QuestionBankResponseDto updateQuestion(Long id, QuestionBankDto dto) {
        QuestionBank question = questionBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.setCategory(dto.getCategory());
        question.setDifficulty(dto.getDifficulty());
        question.setTitle(dto.getTitle());
        question.setTopic(dto.getTopic());
        return mapToDto(questionBankRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long id) {
        if (!questionBankRepository.existsById(id)) {
            throw new RuntimeException("Question not found");
        }
        questionBankRepository.deleteById(id);
    }

    @Override
    public List<QuestionBankResponseDto> getAllQuestions() {
        List<QuestionBank> list = questionBankRepository.findAll();
        List<QuestionBankResponseDto> dtoList = new ArrayList<>();
        for (QuestionBank q : list) {
            dtoList.add(mapToDto(q));
        }
        return dtoList;
    }

    @Override
    public List<QuestionBankResponseDto> searchQuestions(String keyword) {
        List<QuestionBank> list = questionBankRepository
                .findByTitleContainingIgnoreCaseOrTopicContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrDifficultyContainingIgnoreCase(
                        keyword, keyword, keyword, keyword
                );
        List<QuestionBankResponseDto> dtoList = new ArrayList<>();
        for (QuestionBank q : list) {
            dtoList.add(mapToDto(q));
        }
        return dtoList;
    }

    private QuestionBankResponseDto mapToDto(QuestionBank question) {
        QuestionBankResponseDto dto = new QuestionBankResponseDto();
        dto.setId(question.getId());
        dto.setCategory(question.getCategory());
        dto.setDifficulty(question.getDifficulty());
        dto.setTitle(question.getTitle());
        dto.setTopic(question.getTopic());
        dto.setCreatedBy(question.getCreatedBy());
        dto.setCreatedDate(question.getCreatedDate());
        return dto;
    }
}
