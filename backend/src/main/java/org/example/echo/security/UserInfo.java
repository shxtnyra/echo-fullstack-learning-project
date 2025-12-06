package org.example.echo.security;

import org.example.echo.enums.Role;

public record UserInfo(Long id, String username, Role role) {
}
