package com.mockInterview.service;



import com.mockInterview.requestDtos.VoiceInterviewRequest;
import com.mockInterview.responseDtos.VoiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiInterviewService {

 @Value("${ai.service.url:http://localhost:8000}")
 private String aiServiceUrl;

 @Autowired
 private RestTemplate restTemplate;

 public VoiceResponse startInterview(String language) {
     String url = aiServiceUrl + "/start-interview";
     
     VoiceInterviewRequest request = new VoiceInterviewRequest(language, null);
     
     HttpHeaders headers = new HttpHeaders();
     headers.setContentType(MediaType.APPLICATION_JSON);
     
     HttpEntity<VoiceInterviewRequest> entity = new HttpEntity<>(request, headers);
     
     ResponseEntity<VoiceResponse> response = restTemplate.exchange(
         url, HttpMethod.POST, entity, VoiceResponse.class);
     
     return response.getBody();
 }

 public VoiceResponse getNextQuestion(String sessionId) {
     String url = aiServiceUrl + "/next-question";
     
     VoiceInterviewRequest request = new VoiceInterviewRequest();
     request.setSessionId(sessionId);
     
     HttpHeaders headers = new HttpHeaders();
     headers.setContentType(MediaType.APPLICATION_JSON);
     
     HttpEntity<VoiceInterviewRequest> entity = new HttpEntity<>(request, headers);
     
     ResponseEntity<VoiceResponse> response = restTemplate.exchange(
         url, HttpMethod.POST, entity, VoiceResponse.class);
     
     return response.getBody();
 }

 public VoiceResponse submitAnswer(String sessionId, MultipartFile audioFile) {
     String url = aiServiceUrl + "/submit-answer";
     
     HttpHeaders headers = new HttpHeaders();
     headers.setContentType(MediaType.MULTIPART_FORM_DATA);
     
     MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
     body.add("session_id", sessionId);
     
     if (audioFile != null && !audioFile.isEmpty()) {
         body.add("audio_file", audioFile.getResource());
     }
     
     HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
     
     ResponseEntity<VoiceResponse> response = restTemplate.exchange(
         url, HttpMethod.POST, entity, VoiceResponse.class);
     
     return response.getBody();
 }

 public Map<String, Object> getSessionStatus(String sessionId) {
     String url = aiServiceUrl + "/session-status/" + sessionId;
     
     ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
     return response.getBody();
 }
}