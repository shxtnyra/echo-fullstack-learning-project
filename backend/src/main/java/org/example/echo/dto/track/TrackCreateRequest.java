package org.example.echo.dto.track;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record TrackCreateRequest(@NotBlank @Size(min = 1, max = 256) String title,
                                 Long artistId,
                                 Long sourceId,
                                 Long albumId,
                                 List<Long> tagIds) {
}
