package org.example.echo.dto.auth;

import org.example.echo.dto.user.UserResponse;

public record RegisterResponse(UserResponse user, TokenPair tokens) {
}
