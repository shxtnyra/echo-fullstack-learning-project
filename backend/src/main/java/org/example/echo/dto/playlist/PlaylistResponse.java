package org.example.echo.dto.playlist;

import org.example.echo.dto.track.TrackResponse;

import java.util.List;

public record PlaylistResponse(Long id, String name, String description, String coverPath, List<TrackResponse> tracks) {
}
