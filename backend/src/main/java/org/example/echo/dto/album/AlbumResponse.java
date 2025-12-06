package org.example.echo.dto.album;

import org.example.echo.dto.artist.ArtistResponse;

public record AlbumResponse(Long id, String title, ArtistResponse artist) {
}
