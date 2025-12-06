package org.example.echo.exception;

import java.time.LocalDateTime;

public record ErrorResponse(String message,
                            int status,
                            String error,
                            LocalDateTime timestamp,
                            String path) {
}
