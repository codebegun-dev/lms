//package com.mockInterview.aiEngine;
//
//import org.springframework.web.bind.annotation.*;
//import com.mockInterview.entity.InterviewMedia;
//import com.mockInterview.repository.InterviewMediaRepository;
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/api/whisper")
//@RequiredArgsConstructor
//public class WhisperController {
//
//    private final WhisperProcessService whisperService;
//    private final InterviewMediaRepository mediaRepo;
//
//    @PostMapping("/{interviewId}/transcribe")
//    public String transcribe(@PathVariable Long interviewId) throws Exception {
//
//        InterviewMedia media = mediaRepo.findByInterviewId(interviewId);
//
//        if (media == null) {
//            throw new RuntimeException("Audio not found for this interview");
//        }
//
//        String audioPath = media.getAudioPath();
//
//        // ✅ Trigger Whisper async — no return value
//        whisperService.processAudio(interviewId, audioPath);
//
//        return "✅ Whisper transcription started for interview: " + interviewId;
//    }
//}

package com.mockInterview.aiEngine;

import com.mockInterview.entity.InterviewMedia;
import com.mockInterview.repository.InterviewMediaRepository;
import com.mockInterview.util.WhisperPathUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/whisper")
@RequiredArgsConstructor
public class WhisperController {

    private final WhisperProcessService whisperService;
    private final InterviewMediaRepository mediaRepo;

    @GetMapping("/status")
    public String status() {
        String exe = WhisperPathUtil.getWhisperExecutable();
        String model = WhisperPathUtil.getModelFile();

        boolean ok = Files.exists(Path.of(exe)) && Files.exists(Path.of(model));
        return ok ? "READY" : "NOT_READY - exe:" + exe + " model:" + model;
    }

    // Manual trigger (if needed) - uses InterviewMedia audioPath from DB
    @PostMapping("/{interviewId}/transcribe")
    public String transcribe(@PathVariable Long interviewId) {
        InterviewMedia media = mediaRepo.findByInterviewId(interviewId);
        if (media == null || media.getAudioPath() == null) return "NO_AUDIO";
        whisperService.processAudio(interviewId, media.getAudioPath());
        return "Transcription started (async) for interview: " + interviewId;
    }
}

