package org.example.echo.dto.track;

import org.example.echo.dto.album.AlbumResponse;
import org.example.echo.dto.artist.ArtistResponse;
import org.example.echo.dto.source.SourceResponse;

import java.time.LocalDateTime;
import java.util.List;

public record TrackResponse(Long id, String title,
                            long duration, LocalDateTime createAt,
                            ArtistResponse artist, SourceResponse source, AlbumResponse album) {
}
