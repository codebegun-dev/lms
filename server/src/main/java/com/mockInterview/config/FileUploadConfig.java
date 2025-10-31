package com.mockInterview.config;


import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import jakarta.servlet.MultipartConfigElement;

@Configuration
public class FileUploadConfig {
    
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        
        // Set maximum file size
        factory.setMaxFileSize(DataSize.ofGigabytes(1)); // 1GB
        factory.setMaxRequestSize(DataSize.ofGigabytes(1)); // 1GB
        
        // Or use megabytes
        // factory.setMaxFileSize(DataSize.ofMegabytes(500)); // 500MB
        // factory.setMaxRequestSize(DataSize.ofMegabytes(500)); // 500MB
        
        return factory.createMultipartConfig();
    }
}