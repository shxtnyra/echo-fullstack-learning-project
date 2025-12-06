package org.example.echo.service;

import lombok.RequiredArgsConstructor;
import org.example.echo.dto.auth.*;
import org.example.echo.entity.RefreshToken;
import org.example.echo.entity.User;
import org.example.echo.exception.custom.InvalidCredentialsException;
import org.example.echo.exception.custom.InvalidRefreshTokenException;
import org.example.echo.exception.custom.EntityAlreadyExistsException;
import org.example.echo.mapper.UserMapper;
import org.example.echo.repository.RefreshTokenRepository;
import org.example.echo.repository.UserRepository;
import org.example.echo.configuration.JwtConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ImageFileService imageFileService;
    private final JwtConfig jwtConfig;

    @Value("${jwt.session.limit}")
    private int userActiveSessionLimit;

    @Value("${jwt.session.retention-days}")
    private int retentionDays;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpirationMs;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username()))
            throw new EntityAlreadyExistsException("User", request.username());

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);
        TokenPair tokenPair = generateTokens(user);

        return new RegisterResponse(UserMapper.toResponse(user), tokenPair);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPassword()))
            throw new InvalidCredentialsException();

        enforceSessionLimit(user);
        TokenPair tokenPair = generateTokens(user);

        return new LoginResponse(UserMapper.toResponse(user), tokenPair);
    }

    public TokenPair refresh(RefreshTokenRequest request) {
        RefreshToken oldRefreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(InvalidRefreshTokenException::new);

        if (oldRefreshToken.getExpiryDate().isBefore(Instant.now()))
            throw new InvalidRefreshTokenException();

        // Подозрительно, ведь токен отзывается только если  пользователь лично закрывал сессию либо рефрешем либо логаутом
        if (oldRefreshToken.isRevoked())
            throw new InvalidRefreshTokenException();

        revokeToken(oldRefreshToken);

        return generateTokens(oldRefreshToken.getUser());
    }

    public void logout(RefreshTokenRequest request) {
        RefreshToken oldRefreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(InvalidRefreshTokenException::new);

        if (oldRefreshToken.getExpiryDate().isBefore(Instant.now()))
            throw new InvalidRefreshTokenException();

        revokeToken(oldRefreshToken);
    }

    /*
        Генерация обоих токкенов
     */
    private TokenPair generateTokens(User user) {
        String accessToken = jwtConfig.generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return new TokenPair(accessToken, refreshToken.getToken());
    }

    /*
        Генерация и сохранение рефреш токена
     */
    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .createAt(Instant.now())
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .build();

        refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    /*
        Удаление лишних сессий пользователя.
        P.S. Сделно через хоть и понятно что при неизменном количестве максимальных сессий
        всегда придётся удлять только одну сессию. Всё равно сделнно удаления сразу пачки на случай
        если их максимум будет уменьшен.
     */
    private void enforceSessionLimit(User user) {
        List<RefreshToken> activeTokens = refreshTokenRepository.findUserActiveTokens(user.getId(), Instant.now());

        if (activeTokens.size() >= userActiveSessionLimit) {
            List<RefreshToken> sortedTokens = activeTokens
                    .stream().sorted(Comparator.comparing(RefreshToken::getCreateAt))
                    .limit(activeTokens.size() - userActiveSessionLimit + 1)
                    .toList();

            refreshTokenRepository.deleteAll(sortedTokens);
        }
    }

    /*
        Отзыв токена
     */
    private void revokeToken(RefreshToken refreshToken) {
        refreshToken.setRevoked(true);
        refreshToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(refreshToken);
    }

    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupExpiredToken() {
        // Храним 30 дней
        Instant currentTime = Instant.now();
        Instant retentionDate = currentTime.minus(retentionDays, ChronoUnit.DAYS);

        refreshTokenRepository.deleteOldRevokeToken(currentTime, retentionDate);
    }
}
