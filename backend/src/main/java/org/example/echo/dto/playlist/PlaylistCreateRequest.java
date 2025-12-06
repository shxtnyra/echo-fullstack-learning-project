package org.example.echo.dto.playlist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PlaylistCreateRequest(@NotBlank @Size(min = 1, max = 128) String name,
                                    @NotBlank String description,
                                    @NotNull List<Long> trackIds) {
}
