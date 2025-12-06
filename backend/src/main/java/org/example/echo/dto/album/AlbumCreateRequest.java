package org.example.echo.dto.album;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AlbumCreateRequest(@NotBlank @Size(min = 1, max = 128) String title, @NotNull Long artistId) {
}
