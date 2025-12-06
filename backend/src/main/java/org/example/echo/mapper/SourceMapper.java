package org.example.echo.mapper;

import org.example.echo.dto.source.SourceResponse;
import org.example.echo.entity.Source;

public class SourceMapper {
    public static SourceResponse toResponse(Source source) {
        if (source == null) {
            return null;
        }

        return new SourceResponse(
                source.getId(),
                source.getName()
        );
    }
}
