package org.example.echo.mapper;

import org.example.echo.dto.user.UserResponse;
import org.example.echo.entity.User;
import org.example.echo.util.UrlUtil;

public class UserMapper {
    public static UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                UrlUtil.toFullUrl(user.getAvatarUrl())
        );
    }
}
