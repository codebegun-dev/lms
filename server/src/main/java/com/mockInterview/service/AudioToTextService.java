package com.mockInterview.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AudioToTextService {
    
    @Value("${app.assemblyai.apikey:47f09c6d2f994145a37a300952a0a2be}")
    private String assemblyAIApiKey;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public AudioToTextService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();
        System.out.println("AudioToTextService initialized");
        System.out.println("API Key: " + (assemblyAIApiKey != null ? 
            assemblyAIApiKey.substring(0, Math.min(assemblyAIApiKey.length(), 10)) + "..." : "NULL"));
    }
    
    /**
     * Convert audio to text using AssemblyAI - MAIN METHOD
     */
    public String convertAudioToText(byte[] audioData) {
        System.out.println("Starting AssemblyAI transcription...");
        System.out.println("Audio data size: " + (audioData != null ? audioData.length + " bytes" : "NULL"));
        
        try {
            // Step 1: Upload audio file
            System.out.println("Uploading audio file to AssemblyAI...");
            String uploadResponse = webClient.post()
                .uri("https://api.assemblyai.com/v2/upload")
                .header("Authorization", assemblyAIApiKey)
                .header("Content-Type", "application/octet-stream")
                .bodyValue(audioData)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            System.out.println("Upload response received");
            
            JsonNode uploadJson = objectMapper.readTree(uploadResponse);
            String uploadUrl = uploadJson.get("upload_url").asText();
            System.out.println("Audio uploaded to: " + uploadUrl);
            
            // Step 2: Start transcription
            String transcriptRequest = String.format(
                "{\"audio_url\": \"%s\"}", uploadUrl);
            
            System.out.println("Starting transcription...");
            String transcriptResponse = webClient.post()
                .uri("https://api.assemblyai.com/v2/transcript")
                .header("Authorization", assemblyAIApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(transcriptRequest)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            System.out.println("Transcript response received");
            
            JsonNode transcriptJson = objectMapper.readTree(transcriptResponse);
            String transcriptId = transcriptJson.get("id").asText();
            System.out.println("Transcript ID: " + transcriptId);
            
            // Step 3: Poll for results
            return pollTranscriptionResult(transcriptId);
            
        } catch (Exception e) {
            System.err.println("AssemblyAI transcription failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Audio transcription failed: " + e.getMessage());
        }
    }
    
    /**
     * Poll for transcription results
     */
    private String pollTranscriptionResult(String transcriptId) {
        int maxAttempts = 30;
        int attempt = 0;
        
        System.out.println("Polling for transcription results...");
        
        while (attempt < maxAttempts) {
            try {
                String statusResponse = webClient.get()
                    .uri("https://api.assemblyai.com/v2/transcript/" + transcriptId)
                    .header("Authorization", assemblyAIApiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
                
                JsonNode statusJson = objectMapper.readTree(statusResponse);
                String status = statusJson.get("status").asText();
                
                System.out.println("Poll attempt " + (attempt + 1) + ": Status = " + status);
                
                if ("completed".equals(status)) {
                    String text = statusJson.get("text").asText();
                    System.out.println("Transcription completed successfully!");
                    System.out.println("Transcribed Text Length: " + text.length() + " characters");
                    if (text.length() > 100) {
                        System.out.println("First 100 chars: " + text.substring(0, 100) + "...");
                    } else {
                        System.out.println("Full text: " + text);
                    }
                    return text;
                } else if ("failed".equals(status)) {
                    String error = statusJson.get("error").asText();
                    System.err.println("Transcription failed: " + error);
                    throw new RuntimeException("Transcription failed: " + error);
                } else if ("error".equals(status)) {
                    String error = statusJson.has("error") ? statusJson.get("error").asText() : "Unknown error";
                    System.err.println("Transcription error: " + error);
                    throw new RuntimeException("Transcription error: " + error);
                }
                
                // Wait 2 seconds before next poll
                Thread.sleep(2000);
                attempt++;
                
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Transcription polling interrupted");
            } catch (Exception e) {
                System.err.println("Error during polling: " + e.getMessage());
                attempt++;
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Polling interrupted");
                }
            }
        }
        
        throw new RuntimeException("Transcription timeout after " + maxAttempts + " attempts");
    }
    
    /**
     * Alternative method with content type parameter (if needed)
     */
    public String convertAudioToText(byte[] audioData, String contentType) {
        // For now, just call the main method
        return convertAudioToText(audioData);
    }
    
    /**
     * Test method to verify service is working
     */
    public String testService() {
        return "AudioToTextService is working correctly. API Key: " + 
               (assemblyAIApiKey != null ? "Present" : "Missing");
    }
}