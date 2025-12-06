package org.example.echo.dto.auth;

import org.example.echo.dto.user.UserResponse;

public record LoginResponse(UserResponse user, TokenPair tokens) {
}
