package org.example.echo.mapper;

import org.example.echo.dto.artist.ArtistResponse;
import org.example.echo.entity.Artist;

public class ArtistMapper {
    public static ArtistResponse toResponse(Artist artist) {
        if (artist == null) {
            return null;
        }

        return new ArtistResponse(
                artist.getId(),
                artist.getName()
        );
    }
}
