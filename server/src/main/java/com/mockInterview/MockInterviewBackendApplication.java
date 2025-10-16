package com.mockInterview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync 
@EnableScheduling
public class MockInterviewBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MockInterviewBackendApplication.class, args);
	  System.out.println("MY APPLICATION STARTED....");
	}

}
