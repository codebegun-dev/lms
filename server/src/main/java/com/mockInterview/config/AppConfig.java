package com.mockInterview.config;

//src/main/java/com/interview/config/AppConfig.java


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
 
 @Bean
 public RestTemplate restTemplate() {
     return new RestTemplate();
 }
}
