package org.example.echo.exception.custom;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String entityName, String identifier) {
        super("%s not found: %s".formatted(entityName, identifier));
    }

    public EntityNotFoundException(String entityName, Long id) {
        super("%s not found with id: %s".formatted(entityName, id));
    }
}
