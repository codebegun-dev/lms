package com.mockInterview.service;

public interface TranscriptionService {

    /**
     * Transcribe the audio file using AI (Whisper / AssemblyAI / etc.)
     * @param audioFilePath Path of the audio file to transcribe
     * @return transcribed text
     */
    String transcribeAudio(String audioFilePath);
}
