package org.example.echo.dto.tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TagCreateRequest(@NotBlank @Size(min = 1, max = 128) String name) {
}
