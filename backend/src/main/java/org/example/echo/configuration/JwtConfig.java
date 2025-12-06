package org.example.echo.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.example.echo.entity.User;
import org.example.echo.enums.Role;
import org.example.echo.security.UserInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.Date;

@Configuration
public class JwtConfig {
    @Value("${jwt.access.secret}")
    private String accessTokenSecret;

    @Value("${jwt.access.expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpiration;

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("username", user.getUsername())
                .claim("role", user.getRole().toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(Keys.hmacShaKeyFor(accessTokenSecret.getBytes()), Jwts.SIG.HS512)
                .compact();
    }

    public UserInfo getInfoFromToken(String token) {
        Claims claims =Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(accessTokenSecret.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return new UserInfo(
                Long.valueOf(claims.getSubject()),
                claims.get("username", String.class),
                Role.valueOf(claims.get("role", String.class))
        );
    }
}
