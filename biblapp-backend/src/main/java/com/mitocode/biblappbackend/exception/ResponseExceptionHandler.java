package com.mitocode.biblappbackend.exception;

import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ModelNotFoundException.class)
    public ResponseEntity<CustomErrorTemplate> handleModelNotFoundException(
            ModelNotFoundException ex,
            WebRequest request) {

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<CustomErrorTemplate> handleDateTimeParseException(
            DateTimeParseException ex,
            WebRequest request) {

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity<CustomErrorTemplate> handleArithmeticException(
            ArithmeticException ex,
            WebRequest request) {

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CustomErrorTemplate> handleIllegalArgumentException(
            IllegalArgumentException ex,
            WebRequest request) {

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<CustomErrorTemplate> handleIllegalStateException(
            IllegalStateException ex,
            WebRequest request) {

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    

    @Override
    protected @Nullable ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        String msg = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(","));

        CustomErrorTemplate error = new CustomErrorTemplate(
                LocalDateTime.now(),
                msg,
                request.getDescription(false)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}