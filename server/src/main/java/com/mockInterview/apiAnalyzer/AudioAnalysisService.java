package com.mockInterview.apiAnalyzer;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mockInterview.responseDtos.AudioAnalysisResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;

@Service
public class AudioAnalysisService {

    private final RestTemplate restTemplate = new RestTemplate();

    public AudioAnalysisResponse analyzeAudio(File audioFile) {
        try {
            String flaskUrl = "http://127.0.0.1:5000/analyze";

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(audioFile));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, requestEntity, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            // Ignore unknown fields in case Flask adds extra keys
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            return objectMapper.readValue(response.getBody(), AudioAnalysisResponse.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse Flask response: " + e.getMessage());
        }
    }
}
