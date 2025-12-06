package org.example.echo.exception.custom;

public class EntityAlreadyExistsException extends RuntimeException{
    public EntityAlreadyExistsException(String entityName, String identifier) {
        super("%s already exists: %s".formatted(entityName, identifier));
    }
}
