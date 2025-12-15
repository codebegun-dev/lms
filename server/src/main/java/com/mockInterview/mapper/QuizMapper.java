package com.mockInterview.mapper;

import com.mockInterview.entity.Quiz;
import com.mockInterview.entity.Topic;
import com.mockInterview.entity.SubTopic;
import com.mockInterview.requestDtos.QuizRequestDto;
import com.mockInterview.responseDtos.QuizResponseDto;

public class QuizMapper {

    private QuizMapper() {
        // prevent object creation
    }

    // ===============================
    // RequestDto → Entity
    // ===============================
    public static Quiz toEntity(
            QuizRequestDto dto,
            Topic topic,
            SubTopic subTopic
    ) {
        return Quiz.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .timeLimit(dto.getTimeLimit())
                .totalMarks(dto.getTotalMarks())

                // relations
                .topic(topic)
                .subTopic(subTopic)

                // quiz settings
                .quizType(dto.getQuizType())
                .showResults(dto.getShowResults())

                // security
                .enableTabSwitchRestriction(dto.getEnableTabSwitchRestriction())
                .maxTabSwitchAttempts(dto.getMaxTabSwitchAttempts())
                .enableCamera(dto.getEnableCamera())
                .enableRecording(dto.getEnableRecording())

                // private quiz
                .restrictedEmails(dto.getRestrictedEmails())
                .build();
    }

    // ===============================
    // Entity → ResponseDto
    // ===============================
    public static QuizResponseDto toResponseDto(Quiz quiz) {

        return QuizResponseDto.builder()
                .id(quiz.getId())

                // basic info
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimit(quiz.getTimeLimit())
                .totalMarks(quiz.getTotalMarks())

                // topic
                .topicId(
                        quiz.getTopic() != null ? quiz.getTopic().getId() : null
                )
                .topicName(
                        quiz.getTopic() != null ? quiz.getTopic().getName() : null
                )

                // subtopic
                .subTopicId(
                        quiz.getSubTopic() != null ? quiz.getSubTopic().getId() : null
                )
                .subTopicName(
                        quiz.getSubTopic() != null ? quiz.getSubTopic().getName() : null
                )

                // quiz settings
                .quizType(quiz.getQuizType())
                .showResults(quiz.getShowResults())

                // security
                .enableTabSwitchRestriction(quiz.getEnableTabSwitchRestriction())
                .maxTabSwitchAttempts(quiz.getMaxTabSwitchAttempts())
                .enableCamera(quiz.getEnableCamera())
                .enableRecording(quiz.getEnableRecording())

                // private quiz
                .restrictedEmails(quiz.getRestrictedEmails())

                // audit
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .createdBy(quiz.getCreatedBy())
                .updatedBy(quiz.getUpdatedBy())

                .build();
    }
}
