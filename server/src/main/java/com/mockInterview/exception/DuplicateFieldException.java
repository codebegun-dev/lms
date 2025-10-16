package com.mockInterview.exception;

public class DuplicateFieldException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	
	public DuplicateFieldException(String msg) {
		super(msg);
	}

}
