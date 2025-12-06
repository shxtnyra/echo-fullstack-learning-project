package org.example.echo.repository;

import org.example.echo.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Query(value = """
            SELECT * FROM refresh_tokens
            WHERE user_id = :userId
            AND revoked = false
            AND expiry_date > :now
            """, nativeQuery = true)
    public List<RefreshToken> findUserActiveTokens(@Param("userId") Long userId, @Param("now")Instant now);

    @Query(value = """
            DELETE FROM refresh_tokens
            WHERE (revoked = true AND revoked_at < :retentionDate)
            OR (expiry_date < :currentTime)
            """, nativeQuery = true)
    public void deleteOldRevokeToken(@Param("currentTime") Instant currentTime, @Param("retentionDate") Instant retentionDate);
}
