package com.mockInterview.controller;

import com.mockInterview.service.TranscriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transcripts")
@RequiredArgsConstructor
public class TranscriptController {

    private final TranscriptService transcriptService;

    // By interview ID
    @GetMapping("/byInterview/{interviewId}")
    public String getByInterviewId(@PathVariable Long interviewId) {
        return transcriptService.getTranscriptTextByInterviewId(interviewId);
    }

    // By transcript primary key
    @GetMapping("/byId/{transcriptId}")
    public String getById(@PathVariable Long transcriptId) {
        return transcriptService.getTranscriptTextById(transcriptId);
    }
}
