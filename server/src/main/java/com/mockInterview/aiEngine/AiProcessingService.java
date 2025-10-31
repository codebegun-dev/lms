//package com.mockInterview.aiEngine;
//
//import com.mockInterview.entity.InterviewAnalysis;
//import com.mockInterview.entity.InterviewMedia;
//import com.mockInterview.entity.StudentInterview;
//import com.mockInterview.exception.ResourceNotFoundException;
//import com.mockInterview.repository.InterviewAnalysisRepository;
//import com.mockInterview.repository.InterviewMediaRepository;
//import com.mockInterview.repository.StudentInterviewRepository;
//import com.mockInterview.util.FileStorageUtil;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
//
//@Service
//public class AiProcessingService {
//
//    @Value("${whisper.script}")
//    private String whisperScriptPath;
//
//    private final StudentInterviewRepository interviewRepo;
//    private final InterviewMediaRepository mediaRepo;
//    private final InterviewAnalysisRepository analysisRepo;
//
//    public AiProcessingService(StudentInterviewRepository interviewRepo,
//                               InterviewMediaRepository mediaRepo,
//                               InterviewAnalysisRepository analysisRepo) {
//        this.interviewRepo = interviewRepo;
//        this.mediaRepo = mediaRepo;
//        this.analysisRepo = analysisRepo;
//    }
//
//    public String processAndAnalyze(Long interviewId) throws Exception {
//
//        StudentInterview interview = interviewRepo.findById(interviewId)
//                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));
//
//        InterviewMedia media = mediaRepo.findByInterviewId(interviewId);
//        if (media == null || media.getAudioPath() == null)
//            throw new RuntimeException("Audio file missing for interview " + interviewId);
//
//        String audioPath = media.getAudioPath();
//        Long studentId = interview.getStudent().getUserId();
//
//        // ✅ Step 1: Get transcript using Whisper
//        String transcriptText = runWhisper(audioPath);
//
//        // ✅ Step 2: Save transcript file on disk
//        String transcriptFilePath = FileStorageUtil.saveTextFile(transcriptText, studentId);
//
//        // ✅ Step 3: Run performance analysis
//        InterviewAnalysis analysis = analyzePerformance(transcriptText);
//
//        analysis.setInterview(interview);
//        analysis.setTranscriptPath(transcriptFilePath);
//        analysis.setTranscriptText(transcriptText);
//
//        analysisRepo.save(analysis);
//
//        return "Transcript + AI Analysis saved successfully!";
//    }
//
//    private String runWhisper(String audioFilePath) throws Exception {
//        ProcessBuilder pb = new ProcessBuilder("python", whisperScriptPath, audioFilePath);
//        pb.redirectErrorStream(true);
//
//        Process process = pb.start();
//        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//        StringBuilder output = new StringBuilder();
//
//        String line;
//        while ((line = reader.readLine()) != null) {
//            output.append(line).append("\n");
//        }
//
//        int exit = process.waitFor();
//        if (exit != 0) throw new RuntimeException("Whisper transcription failed");
//
//        return output.toString().trim();
//    }
//
//    private InterviewAnalysis analyzePerformance(String transcript) {
//
//        // ===== Dummy Scoring Logic =====
//        int communicationScore = transcript.length() > 60 ? 8 : 5;
//        int confidenceScore = transcript.contains("confident") ? 8 : 6;
//        int categoryRoundTypeScore = transcript.contains("Java") ? 9 : 6;
//
//        String overallRating;
//        int avg = (communicationScore + confidenceScore + categoryRoundTypeScore) / 3;
//
//        if (avg >= 8) overallRating = "Excellent";
//        else if (avg >= 6) overallRating = "Good";
//        else overallRating = "Needs Improvement";
//
//        String improvedSuggestions = "Try to provide more structured and detail-oriented responses.";
//        String aiFeedback = "Communication is clear. Improve technical depth and real-world examples.";
//
//        return InterviewAnalysis.builder()
//                .communicationScore(communicationScore)
//                .confidenceScore(confidenceScore)
//                .categoryRoundTypeScore(categoryRoundTypeScore)
//                .overallRating(overallRating)
//                .improvedSuggestions(improvedSuggestions)
//                .aiFeedback(aiFeedback)
//                .build();
//    }
//
//}
