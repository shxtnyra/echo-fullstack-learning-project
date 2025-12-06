package org.example.echo.mapper;

import org.example.echo.dto.album.AlbumResponse;
import org.example.echo.entity.Album;

public class AlbumMapper {

    public static AlbumResponse toResponse(Album album) {
        if (album == null)
            return null;

        return new AlbumResponse(
                album.getId(),
                album.getTitle(),
                ArtistMapper.toResponse(album.getArtist())
        );
    }
}
