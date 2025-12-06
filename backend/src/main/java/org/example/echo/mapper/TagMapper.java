package org.example.echo.mapper;

import org.example.echo.dto.tag.TagResponse;
import org.example.echo.entity.Tag;

public class TagMapper {
    public static TagResponse toResponse(Tag tag) {
        if (tag == null) {
            return null;
        }

        return new TagResponse(
                tag.getId(),
                tag.getName()
        );
    }
}
