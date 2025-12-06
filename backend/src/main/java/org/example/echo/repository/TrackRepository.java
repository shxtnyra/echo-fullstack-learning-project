package org.example.echo.repository;

import org.example.echo.entity.Track;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long> {
    Page<Track> findByArtistId(Long artistId, Pageable pageable);

    Page<Track> findBySourceId(Long sourceId, Pageable pageable);

    Page<Track> findByAlbumId(Long id, Pageable pageable);

    List<Track> findByAlbumId(Long id);

    List<Track> findByArtistId(Long id);

    List<Track> findBySourceId(Long id);
}
