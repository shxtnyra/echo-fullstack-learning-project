package org.example.echo.service;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.example.echo.service.storage.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.FileAlreadyExistsException;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageFileService {
    private final StorageService storageService;

    @Value("${storage.image-bucket:images}")
    private String imageBucketName;

    private final int MAX_GENERATION_NAME_RETRY = 2;

    private final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".jpg", ".jpeg", ".png"
    );

    public String saveImage(MultipartFile file) {
        validateImageFile(file);
        String extensions = getValidatedExtension(file.getOriginalFilename());

        int count = 0;
        while (count < MAX_GENERATION_NAME_RETRY) {
            try {
                String fileName = generateFileName(extensions);
                String fullPath = buildFilePath(fileName);

                return  storageService.saveFile(file, fullPath);
            } catch (FileAlreadyExistsException e) {
                count++;

                if (count >= MAX_GENERATION_NAME_RETRY) {
                    throw new ValidationException("Failed to generate unique filename after " +
                            MAX_GENERATION_NAME_RETRY + " attempts");
                }
            }
        }

        throw new IllegalStateException("Unexpected error in saveImage");
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null)
            throw new ValidationException("Image file cannot be null");

        if (file.isEmpty())
            throw new ValidationException("Image file cannot be empty");

        if (file.getSize() > 4 * 1024 * 1024) {
            throw new ValidationException("Image file size too large. Maximum 2MB allowed");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/"))
            throw new ValidationException("Image file must be an image");
    }

    private String getValidatedExtension(String originalFileName) {
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new ValidationException("Filename cannot be null or empty");
        }

        String extension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ValidationException("Unsupported file extension: " + extension +
                    ". Allowed: " + ALLOWED_EXTENSIONS);
        }

        return extension;
    }

    private String generateFileName(String extension) {
        return UUID.randomUUID().toString() + extension;
    }

    private String buildFilePath(String filePath) {
        return imageBucketName + "/" + filePath;
    }
}