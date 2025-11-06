//package com.mockInterview.aiEngine;
//
//import com.mockInterview.entity.InterviewTranscript;
//import com.mockInterview.entity.StudentInterview;
//import com.mockInterview.repository.InterviewTranscriptRepository;
//import com.mockInterview.repository.StudentInterviewRepository;
//import com.mockInterview.util.FileStorageUtil;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//import java.io.File;
//import java.nio.file.Files;
//import java.nio.file.Paths;
//
//@Service
//@RequiredArgsConstructor
//public class WhisperProcessService {
//
//    @Value("${whisper.path}")
//    private String whisperPath;
//
//    @Value("${whisper.model}")
//    private String modelPath;
//
//    private final StudentInterviewRepository interviewRepo;
//    private final InterviewTranscriptRepository transcriptRepo;
//
//    @Async("whisperExecutor")
//    public void processAudio(Long interviewId, String audioPath) throws Exception {
//
//        StudentInterview interview = interviewRepo.findById(interviewId)
//                .orElseThrow(() -> new RuntimeException("Interview not found"));
//
//        Long studentId = interview.getStudent().getUserId();
//
//        String outputDir = System.getProperty("user.home") + File.separator +
//                "uploads" + File.separator + studentId + File.separator +
//                "interviews" + File.separator + interviewId + File.separator +
//                "transcript";
//
//        Files.createDirectories(Paths.get(outputDir));
//
//        String finalFileName = "final_transcript_" + interviewId + ".txt";
//        String finalFilePathNoExt = outputDir + File.separator + "final_transcript_" + interviewId;
//
//        String command = whisperPath + " -m \"" + modelPath + "\" -f \"" + audioPath +
//                "\" -otxt -of \"" + finalFilePathNoExt + "\"";
//
//        ProcessBuilder builder = new ProcessBuilder("cmd.exe", "/c", command);
//        builder.directory(new File(whisperPath).getParentFile());
//        Process process = builder.start();
//        int exitCode = process.waitFor();
//
//        if (exitCode != 0) {
//            throw new RuntimeException("❌ Whisper failed. Exit code: " + exitCode);
//        }
//
//        String transcriptText = new String(Files.readAllBytes(Paths.get(finalFilePathNoExt + ".txt")));
//
//        String finalSavedPath = FileStorageUtil.saveTranscriptFile(
//                transcriptText, studentId, interviewId, finalFileName
//        );
//
//        InterviewTranscript transcript = InterviewTranscript.builder()
//                .interview(interview)
//                .transcriptFilePath(finalSavedPath)
//                .build();
//
//        transcriptRepo.save(transcript);
//
//        System.out.println("✅ Transcript saved at: " + finalSavedPath);
//    }
// 
//    
//}

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

    @Async("whisperExecutor")
    public void processAudio(Long interviewId, String audioPath) {
        try {
            StudentInterview interview = interviewRepo.findById(interviewId)
                    .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

            Long studentId = interview.getStudent().getUserId();
            String projectRoot = System.getProperty("user.dir");

            String whisperExe = projectRoot + File.separator + "whisper" + File.separator + "bin" + File.separator + (isWindows() ? "whisper-cli.exe" : "whisper");

            // ✅ Whisper model file
            String modelPath = projectRoot + File.separator + "whisper" + File.separator + "models" + File.separator + "ggml-base.en.bin";

            // ✅ FFmpeg path inside project folder
            String ffmpegExe = new File(System.getProperty("user.dir") 
                    + "/whisper/ffmpeg/bin/" 
                    + (isWindows() ? "ffmpeg.exe" : "ffmpeg")).getAbsolutePath();

            // ✅ Output directory
            String outputDir = projectRoot + File.separator + "uploads" + File.separator +
                    studentId + File.separator + "interviews" + File.separator + interviewId + File.separator + "transcript";
            Files.createDirectories(Path.of(outputDir));

            String baseName = "final_transcript_" + interviewId;
            String outputFileNoExt = outputDir + File.separator + baseName;
            String finalFileName = baseName + ".txt";

            // ✅ Convert video/audio to WAV if required
            String processedAudio = audioPath;
            if (audioPath.matches(".*\\.(webm|mp4|m4a)$")) {

                processedAudio = audioPath.replaceAll("\\.(webm|mp4|m4a)$", ".wav");

                File wavFile = new File(processedAudio);
                wavFile.getParentFile().mkdirs(); // ensure parent folder exists

                System.out.println("🎧 Converting to WAV...");
                List<String> ffCmd = Arrays.asList(
                        ffmpegExe,
                        "-i", audioPath,
                        "-ar", "16000",
                        "-ac", "1",
                        "-c:a", "pcm_s16le",
                        processedAudio
                );

                runProcess(ffCmd, "FFMPEG");

                System.out.println("✅ WAV Generated: " + processedAudio);
            }

            // ✅ Whisper execution command
            List<String> whisperCmd = Arrays.asList(
                    whisperExe,
                    "-m", modelPath,
                    "-f", processedAudio,
                    "-otxt",
                    "-of", outputFileNoExt
            );

            runProcess(whisperCmd, "WHISPER");

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
