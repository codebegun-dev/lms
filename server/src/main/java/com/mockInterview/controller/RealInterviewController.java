package com.mockInterview.controller;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/interview")
public class RealInterviewController {

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ Start interview (calls Flask service)
    @PostMapping("/start")
    public ResponseEntity<String> startInterview(@RequestParam String language) {
        String flaskUrl = "http://localhost:8000/start-interview?language=" + language + "&mode=interactive";
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, null, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to contact Python service: " + e.getMessage() + "\"}");
        }
    }

    // ✅ Check job status (polls Flask service)
    @GetMapping("/status/{jobId}")
    public ResponseEntity<String> getJobStatus(@PathVariable String jobId) {
        String flaskUrl = "http://localhost:8000/job-status/" + jobId;
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(flaskUrl, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to contact Python service: " + e.getMessage() + "\"}");
        }
    }

    // ✅ Fetch final report (after interview finishes)
    @GetMapping("/report/{jobId}")
    public ResponseEntity<String> getReport(@PathVariable String jobId) {
        String flaskUrl = "http://localhost:8000/report/" + jobId;
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(flaskUrl, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to contact Python service: " + e.getMessage() + "\"}");
        }
    }
}
