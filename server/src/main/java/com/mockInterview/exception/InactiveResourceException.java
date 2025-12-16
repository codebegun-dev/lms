package com.mockInterview.exception;

public class InactiveResourceException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	
	public InactiveResourceException(String msg) {
		super(msg);
	}
}
