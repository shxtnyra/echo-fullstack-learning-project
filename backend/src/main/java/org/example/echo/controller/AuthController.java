package org.example.echo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.echo.dto.auth.*;
import org.example.echo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Validated
@RequiredArgsConstructor
@RequestMapping("api/v1/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest request) {
        RegisterResponse registerResponse = authService.register(request);
        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenPair> refresh(@RequestBody RefreshTokenRequest refreshToken) {
        TokenPair tokenPair = authService.refresh(refreshToken);
        return ResponseEntity.ok(tokenPair);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody @Valid RefreshTokenRequest refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.noContent().build();
    }
}
