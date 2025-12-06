package org.example.echo.exception;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;
import org.apache.tomcat.util.http.fileupload.impl.SizeLimitExceededException;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.example.echo.exception.custom.InvalidCredentialsException;
import org.example.echo.exception.custom.InvalidRefreshTokenException;
import org.example.echo.exception.custom.EntityAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> entityNotFoundExceptionHandler(EntityNotFoundException e, HttpServletRequest request) {
        ErrorResponse errorResponse = generateErrorResponse(e, request, HttpStatus.NOT_FOUND);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> invalidCredentialsExceptionHandler(InvalidCredentialsException e, HttpServletRequest request) {
        ErrorResponse errorResponse = generateErrorResponse(e, request, HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> userAlreadyExistsExceptionHandler(EntityAlreadyExistsException e, HttpServletRequest request) {
        ErrorResponse errorResponse = generateErrorResponse(e, request, HttpStatus.CONFLICT);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> invalidRefreshTokenExceptionHandler(ValidationException e, HttpServletRequest request) {
        ErrorResponse errorResponse = generateErrorResponse(e, request, HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e, HttpServletRequest request) {
        ErrorResponse errorResponse = generateErrorResponse(e, request, HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> illegalStateExceptionHandler(IllegalStateException e, HttpServletRequest request) {
        ErrorResponse errorResponse = generateErrorResponse(e, request, HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception e, HttpServletRequest request) {
        e.printStackTrace();

        ErrorResponse errorResponse = new ErrorResponse(
                "Internal server error",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                LocalDateTime.now(),
                request.getRequestURL().toString()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private ErrorResponse generateErrorResponse(Exception e, HttpServletRequest request, HttpStatus status) {
        return new ErrorResponse(
                e.getMessage(),
                status.value(),
                status.getReasonPhrase(),
                LocalDateTime.now(),
                request.getRequestURL().toString()
        );
    }
}
