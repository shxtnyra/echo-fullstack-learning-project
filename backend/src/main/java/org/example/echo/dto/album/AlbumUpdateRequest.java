package org.example.echo.dto.album;

import jakarta.validation.constraints.NotBlank;

public record AlbumUpdateRequest(@NotBlank String title) {
}
