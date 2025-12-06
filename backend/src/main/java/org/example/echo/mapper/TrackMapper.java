package org.example.echo.mapper;

import org.example.echo.dto.track.TrackResponse;
import org.example.echo.entity.Track;

import java.util.Optional;

public class TrackMapper {
    public static TrackResponse toResponse(Track track) {
        if (track == null) {
            return null;
        }
        return new TrackResponse(
                track.getId(),
                track.getTitle(),
                track.getDuration(),
                track.getCreatedAt(),
                ArtistMapper.toResponse(track.getArtist()),
                SourceMapper.toResponse(track.getSource()),
                AlbumMapper.toResponse(track.getAlbum())
        );
    }
}
