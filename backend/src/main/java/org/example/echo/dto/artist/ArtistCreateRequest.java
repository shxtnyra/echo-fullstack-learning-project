package org.example.echo.dto.artist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArtistCreateRequest(@NotBlank @Size(min = 1, max = 128) String name) {
}
