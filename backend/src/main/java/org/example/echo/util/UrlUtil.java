package org.example.echo.util;

import org.springframework.beans.factory.annotation.Value;

public class UrlUtil {
    @Value("${app.base-url:http://localhost:8082}")
    private static String baseUrl;

    public static String toFullUrl(String relativePath) {
        if (relativePath == null) return null;
        return baseUrl + "/files/" + relativePath;
    }
}
