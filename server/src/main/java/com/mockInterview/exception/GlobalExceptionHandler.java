//package com.mockInterview.exception;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Set;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.converter.HttpMessageNotReadableException;
//import org.springframework.transaction.TransactionSystemException;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import jakarta.validation.ConstraintViolation;
//import jakarta.validation.ConstraintViolationException;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//	
//	@ExceptionHandler(DuplicateFieldException.class)
//	public ResponseEntity<Map<String, String>> handleDuplicateFieldException(DuplicateFieldException ex) {
//	    Map<String, String> errorResponse = new HashMap<>();
//	    if (ex.getMessage().toLowerCase().contains("email")) {
//	        errorResponse.put("email", ex.getMessage());
//	    } else if (ex.getMessage().toLowerCase().contains("phone")) {
//	        errorResponse.put("phone", ex.getMessage());
//	    } else {
//	        
//	        errorResponse.put("general", ex.getMessage());
//	    }
//
//	    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
//	}
//
//
//@ExceptionHandler(MethodArgumentNotValidException.class)
//public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
//    Map<String, String> errors = new HashMap<>();
//    ex.getBindingResult().getFieldErrors().forEach(error -> {
//        errors.put(error.getField(), error.getDefaultMessage());
//    });
//    return ResponseEntity.badRequest().body(errors);
//}
//
//@ExceptionHandler(HttpMessageNotReadableException.class)
//public ResponseEntity<Map<String, String>> handleEnumParseException(HttpMessageNotReadableException ex) {
//    Map<String, String> error = new HashMap<>();
//    String msg = ex.getMostSpecificCause().getMessage();
//
//    if (msg != null && msg.contains("Role")) {
//        error.put("role", "Invalid role value. Accepted values: STUDENT, INTERVIEWER, ADMIN");
//    } else {
//        error.put("message", "Malformed JSON request");
//    }
//
//    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//}
//
//@ExceptionHandler(Exception.class)
//public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {
//    Map<String, Object> error = new HashMap<>();
//    error.put("message", ex.getMessage());
//    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//}
//@ExceptionHandler(ConstraintViolationException.class)
//public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {
//    Map<String, String> errors = new HashMap<>();
//    Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
//    for (ConstraintViolation<?> violation : violations) {
//        errors.put(violation.getPropertyPath().toString(), violation.getMessage());
//    }
//    return ResponseEntity.badRequest().body(errors);
//}
//@ExceptionHandler(TransactionSystemException.class)
//public ResponseEntity<?> handleTransactionSystemException(TransactionSystemException ex) {
//    Throwable cause = ex.getRootCause();
//    Map<String, String> error = new HashMap<>();
//
//    if (cause instanceof ConstraintViolationException cve) {
//        for (ConstraintViolation<?> violation : cve.getConstraintViolations()) {
//            error.put(violation.getPropertyPath().toString(), violation.getMessage());
//        }
//        return ResponseEntity.badRequest().body(error);
//    }
//
//    error.put("message", cause != null ? cause.getMessage() : "Transaction failed");
//    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
//}
//
//}


package com.mockInterview.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<?> build(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return new ResponseEntity<>(error, status);
    }

    // ================= CUSTOM EXCEPTIONS =================
    @ExceptionHandler(DuplicateFieldException.class)
    public ResponseEntity<?> handleDuplicateField(DuplicateFieldException ex) {
        return build(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return build(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<?> handleUnauthorized(UnauthorizedActionException ex) {
        return build(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // ================= VALIDATION ERRORS =================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(err -> err.getDefaultMessage())
                        .collect(Collectors.joining(", "));
        return build(msg, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {
        String msg = ex.getConstraintViolations()
                       .stream()
                       .map(v -> v.getMessage())
                       .collect(Collectors.joining(", "));
        return build(msg, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<?> handleTransaction(TransactionSystemException ex) {
        Throwable root = ex.getRootCause();

        if (root instanceof ConstraintViolationException cve) {
            String msg = cve.getConstraintViolations()
                            .stream()
                            .map(v -> v.getMessage())
                            .collect(Collectors.joining(", "));
            return build(msg, HttpStatus.BAD_REQUEST);
        }

        return build("Transaction failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ================= BAD JSON FORMAT =================
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleInvalidJson(HttpMessageNotReadableException ex) {
        return build("Malformed JSON request", HttpStatus.BAD_REQUEST);
    }

    // ================= FALLBACK =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception ex) {
        return build(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

