package org.example.echo.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.echo.configuration.JwtConfig;
import org.example.echo.exception.custom.JwtAuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtConfig jwtConfig;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = getToken(request);

        if (accessToken == null || accessToken.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Вместе с валидацией
            UserInfo user = jwtConfig.getInfoFromToken(accessToken);

            var auth = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(user.role().name()))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (JwtException ex) {
            jwtAuthenticationEntryPoint.commence(
                    request,
                    response,
                    new BadCredentialsException("Invalid JWT token", ex)
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
