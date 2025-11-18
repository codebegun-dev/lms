package com.mockInterview.aiEngine;

import com.mockInterview.entity.InterviewTranscript;
import com.mockInterview.entity.StudentInterview;
import com.mockInterview.repository.InterviewTranscriptRepository;
import com.mockInterview.repository.StudentInterviewRepository;
import com.mockInterview.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WhisperProcessService {

    private final StudentInterviewRepository interviewRepo;
    private final InterviewTranscriptRepository transcriptRepo;
    private final TextAnalysisService textAnalysisService;
    

    @Async("whisperExecutor")
    public void processAudio(Long interviewId, String audioPath) {
        try {
            StudentInterview interview = interviewRepo.findById(interviewId)
                    .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

            Long studentId = interview.getStudent().getUserId();
            String projectRoot = System.getProperty("user.dir");

            // Whisper executable
            String whisperExe = projectRoot + File.separator + "whisper" + File.separator + "bin" +
                    File.separator + "Release" + File.separator +
                    (isWindows() ? "whisper-cli.exe" : "whisper");

            // Whisper model file
            String modelPath = projectRoot + File.separator + "whisper" + File.separator +
                    "models" + File.separator + "ggml-base.en.bin";

            // FFmpeg executable
            String ffmpegExe = new File(projectRoot + "/whisper/ffmpeg/bin/" +
                    (isWindows() ? "ffmpeg.exe" : "ffmpeg")).getAbsolutePath();

            // Base uploads directory
            Path baseUploadDir = Path.of(projectRoot, "uploads");

            // Absolute input audio path
            Path inputAudioPath = baseUploadDir.resolve(audioPath).normalize();
            String absAudioPath = inputAudioPath.toAbsolutePath().toString();

            // Output directory for transcript
            String outputDir = baseUploadDir.resolve(studentId + "/interviews/" + interviewId + "/transcript").toString();
            Files.createDirectories(Path.of(outputDir));

            String baseName = "final_transcript_" + interviewId;
            String outputFileNoExt = outputDir + File.separator + baseName;
            String finalFileName = baseName + ".txt";

            // Convert video/audio to WAV if required
            String processedAudio = absAudioPath;
            if (audioPath.matches(".*\\.(webm|mp4|m4a)$")) {
                Path outputAudioPath = inputAudioPath.resolveSibling(
                        inputAudioPath.getFileName().toString().replaceAll("\\.(webm|mp4|m4a)$", ".wav")
                );
                Files.createDirectories(outputAudioPath.getParent());

                processedAudio = outputAudioPath.toAbsolutePath().toString();

                System.out.println("🎧 Converting to WAV...");
                List<String> ffCmd = Arrays.asList(
                        ffmpegExe,
                        "-i", absAudioPath,
                        "-ar", "16000",
                        "-ac", "1",
                        "-c:a", "pcm_s16le",
                        processedAudio
                );

                runProcess(ffCmd, "FFMPEG");
                System.out.println("✅ WAV Generated: " + processedAudio);
            }

            // Run Whisper
            List<String> whisperCmd = Arrays.asList(
                    whisperExe,
                    "-m", modelPath,
                    "-f", processedAudio,
                    "-otxt",
                    "-of", outputFileNoExt
            );

            runProcess(whisperCmd, "WHISPER");

            // Read transcript
            String transcriptText = Files.readString(Path.of(outputFileNoExt + ".txt"), StandardCharsets.UTF_8);

            String savedPath = FileStorageUtil.saveTranscriptFile(
                    transcriptText, studentId, interviewId, finalFileName
            );

            InterviewTranscript transcript = InterviewTranscript.builder()
                    .interview(interview)
                    .transcriptFilePath(savedPath)
                    .build();

            transcriptRepo.save(transcript);

            System.out.println("✅ Transcript saved: " + savedPath);
            
            try {
                System.out.println("🤖 Generating AI Feedback...");
                textAnalysisService.analyzeText(transcriptText, interview);
                System.out.println("🎉 AI Feedback successfully saved in DB!");
            } catch (Exception ex) {
                System.out.println("❌ Error generating AI Feedback: " + ex.getMessage());
            }

        } catch (Exception e) {
            System.out.println("❌ Error in WhisperProcessService: " + e.getMessage());
            e.printStackTrace();
        }
    }


    private void runProcess(List<String> cmd, String tag) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(cmd);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println("[" + tag + "] " + line);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException(tag + " failed with exit code " + exitCode);
        }
    }

    private boolean isWindows() {
        return System.getProperty("os.name").toLowerCase().contains("win");
    }
}

