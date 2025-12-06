package org.example.echo.repository;


import org.example.echo.dto.album.AlbumResponse;
import org.example.echo.entity.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    @Query(value = "SELECT EXISTS(SELECT 1 FROM albums WHERE title = :title)", nativeQuery = true)
    boolean existsByTitle(@Param("title") String title);

    Page<Album> findByArtistId(Long id, Pageable pageable);

    @Query(value = "SELECT * FROM albums WHERE LOWER(title) LIKE LOWER(CONCAT('%', :q, '%')) LIMIT 5", nativeQuery = true)
    List<AlbumResponse> searchByTitle(@Param("q") String q);
}
