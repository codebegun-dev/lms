package com.mockInterview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.mockInterview.service.FlaskStarter;

@SpringBootApplication
@EnableAsync 
@EnableScheduling
public class MockInterviewBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MockInterviewBackendApplication.class, args);
		 // Start Flask before Spring Boot
        //FlaskStarter.startFlaskServer();
	  System.out.println("MY APPLICATION STARTED....");
	  System.out.println("Mock Interview Backend Application Started Successfully!");
	}
	

}
