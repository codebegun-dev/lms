package com.mockInterview.serviceImpl;

import com.mockInterview.entity.InterviewTranscript;
import com.mockInterview.repository.InterviewTranscriptRepository;
import com.mockInterview.service.TranscriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
public class TranscriptServiceImpl implements TranscriptService {

    private final InterviewTranscriptRepository transcriptRepo;

    @Override
    public String getTranscriptTextByInterviewId(Long interviewId) {
        InterviewTranscript transcript = transcriptRepo.findByInterviewId(interviewId);
        if (transcript == null) {
            throw new RuntimeException("Transcript not found for interview: " + interviewId);
        }

        return readTranscriptFile(transcript);
    }

    @Override
    public String getTranscriptTextById(Long transcriptId) {
        InterviewTranscript transcript = transcriptRepo.findById(transcriptId)
                .orElseThrow(() -> new RuntimeException("Transcript not found with id: " + transcriptId));

        return readTranscriptFile(transcript);
    }

    // ✅ Utility method to read file
    private String readTranscriptFile(InterviewTranscript transcript) {
        Path transcriptPath = Path.of(transcript.getTranscriptFilePath());
        if (!Files.exists(transcriptPath)) {
            throw new RuntimeException("Transcript file missing at: " + transcriptPath.toString());
        }

        try {
            return Files.readString(transcriptPath);
        } catch (Exception e) {
            throw new RuntimeException("Failed to read transcript: " + e.getMessage());
        }
    }
}
