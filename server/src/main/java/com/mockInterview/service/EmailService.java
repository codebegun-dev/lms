package com.mockInterview.service;

public interface EmailService {
	
	public void sendWelcomeEmail(String toEmail, String firstName);
	
	 public void sendResetPasswordEmail(String toEmail, String resetLink);
	 
	 void sendNonStudentWelcomeEmail(String toEmail, String firstName, String loginPassword, String resetLink);

}
