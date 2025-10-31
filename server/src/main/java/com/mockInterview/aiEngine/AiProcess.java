package com.mockInterview.aiEngine;

import com.mockInterview.entity.InterviewAnalysis;
import com.mockInterview.entity.InterviewMedia;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.repository.InterviewAnalysisRepository;
import com.mockInterview.repository.InterviewMediaRepository;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.util.FileStorageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;


@Service
public class AiProcess {

    @Value("${whisper.exe.path}")
    private String whisperExePath;  // example: C:/whisper-cpp/bin/whisper-cli.exe

    @Value("${whisper.model.path}")
    private String whisperModelPath; // example: C:/whisper-cpp/models/ggml-base.en.bin

    private final InterviewMediaRepository mediaRepo;
    private final StudentInterviewRepository interviewRepo;
    private final InterviewAnalysisRepository analysisRepo;

    public AiProcess(InterviewMediaRepository mediaRepo,
                               StudentInterviewRepository interviewRepo,
                               InterviewAnalysisRepository analysisRepo) {
        this.mediaRepo = mediaRepo;
        this.interviewRepo = interviewRepo;
        this.analysisRepo = analysisRepo;
    }

    public String processAndSaveTranscript(Long interviewId) throws Exception {

        StudentInterview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        InterviewMedia media = mediaRepo.findByInterviewId(interviewId);
        if (media == null || media.getAudioPath() == null) {
            throw new RuntimeException("Audio file not found for this interview");
        }

        String audioPath = media.getAudioPath();
        Long studentId = interview.getStudent().getUserId();

        // Whisper command...
        ProcessBuilder builder = new ProcessBuilder(
                whisperExePath, "-m", whisperModelPath,
                "-f", audioPath, "-otxt", "-of", "temp"
        );
        builder.directory(new File(audioPath).getParentFile());
        builder.redirectErrorStream(true);

        Process process = builder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder transcriptBuilder = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            transcriptBuilder.append(line).append("\n");
        }

        if (process.waitFor() != 0)
            throw new RuntimeException("Whisper failed to process audio");

        String transcript = transcriptBuilder.toString().trim();
        if (transcript.isEmpty())
            throw new RuntimeException("Empty transcript");

        String finalTranscriptPath = FileStorageUtil.saveTranscriptFile(transcript, studentId, interviewId);

        // ✅ Check if analysis exists
        InterviewAnalysis existing = analysisRepo.findByInterviewId(interviewId);

        if (existing != null) {
            // ✅ Update
            existing.setTranscriptPath(finalTranscriptPath);
            existing.setTranscriptText(transcript);
            analysisRepo.save(existing);
            return "Transcript UPDATED & saved at: " + finalTranscriptPath;
        }

        // ✅ Else insert new
        InterviewAnalysis analysis = InterviewAnalysis.builder()
                .interview(interview)
                .transcriptPath(finalTranscriptPath)
                .transcriptText(transcript)
                .build();

        analysisRepo.save(analysis);
        return "Transcript CREATED & saved at: " + finalTranscriptPath;
    }

}
