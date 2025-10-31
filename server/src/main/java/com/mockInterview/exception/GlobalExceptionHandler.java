package com.mockInterview.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(DuplicateFieldException.class)
	public ResponseEntity<Map<String, String>> handleDuplicateFieldException(DuplicateFieldException ex) {
	    Map<String, String> errorResponse = new HashMap<>();
	    if (ex.getMessage().toLowerCase().contains("email")) {
	        errorResponse.put("email", ex.getMessage());
	    } else if (ex.getMessage().toLowerCase().contains("phone")) {
	        errorResponse.put("phone", ex.getMessage());
	    } else {
	        
	        errorResponse.put("general", ex.getMessage());
	    }

	    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}


@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(error -> {
        errors.put(error.getField(), error.getDefaultMessage());
    });
    return ResponseEntity.badRequest().body(errors);
}

@ExceptionHandler(HttpMessageNotReadableException.class)
public ResponseEntity<Map<String, String>> handleEnumParseException(HttpMessageNotReadableException ex) {
    Map<String, String> error = new HashMap<>();
    String msg = ex.getMostSpecificCause().getMessage();

    if (msg != null && msg.contains("Role")) {
        error.put("role", "Invalid role value. Accepted values: STUDENT, INTERVIEWER, ADMIN");
    } else {
        error.put("message", "Malformed JSON request");
    }

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
}

@ExceptionHandler(Exception.class)
public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {
    Map<String, Object> error = new HashMap<>();
    error.put("message", ex.getMessage());
    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
}
@ExceptionHandler(ConstraintViolationException.class)
public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {
    Map<String, String> errors = new HashMap<>();
    Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
    for (ConstraintViolation<?> violation : violations) {
        errors.put(violation.getPropertyPath().toString(), violation.getMessage());
    }
    return ResponseEntity.badRequest().body(errors);
}
@ExceptionHandler(TransactionSystemException.class)
public ResponseEntity<?> handleTransactionSystemException(TransactionSystemException ex) {
    Throwable cause = ex.getRootCause();
    Map<String, String> error = new HashMap<>();

    if (cause instanceof ConstraintViolationException cve) {
        for (ConstraintViolation<?> violation : cve.getConstraintViolations()) {
            error.put(violation.getPropertyPath().toString(), violation.getMessage());
        }
        return ResponseEntity.badRequest().body(error);
    }

    error.put("message", cause != null ? cause.getMessage() : "Transaction failed");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
}

}
