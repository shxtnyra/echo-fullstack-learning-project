package org.example.echo.mapper;

import org.example.echo.dto.playlist.PlaylistResponse;
import org.example.echo.entity.Playlist;

public class PlaylistMapper {
    public static PlaylistResponse toResponse(Playlist playlist) {
        if (playlist == null) {
            return null;
        }

        return new PlaylistResponse(
                playlist.getId(),
                playlist.getName(),
                playlist.getDescription(),
                playlist.getCoverPath(),
                playlist.getTracks().stream().map(TrackMapper::toResponse).toList()
        );
    }
}
