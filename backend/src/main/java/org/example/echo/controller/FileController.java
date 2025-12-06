package org.example.echo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.echo.service.storage.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("api/v1/media")
public class FileController {

    private final StorageService fileStorageService;

    public FileController(StorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{bucketName}/{fileName:.+}")
    public ResponseEntity<Resource> loadFile(
            @PathVariable String bucketName,
            @PathVariable String fileName,
            HttpServletRequest request) {

        String fullPath = bucketName + "/" + fileName;

        Resource file = fileStorageService.loadFile(fullPath);

        String mimeType = request.getServletContext()
                .getMimeType(fileName);

        MediaType mediaType = (mimeType != null)
                ? MediaType.parseMediaType(mimeType)
                : MediaType.APPLICATION_OCTET_STREAM;

        // Меняем кодировку названия ибо спецификация HTTP/1.1 (RFC 2616) разрешает только ISO-8859-1 (0–255) для имен в заголовках
        String encoded = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encoded + "\"")
                .contentType(mediaType)
                .body(file);
    }

    private MediaType getMediaTypeForFileName(String fileName) {
        String extension = getFileExtension(fileName);

        return switch (extension) {
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png" -> MediaType.IMAGE_PNG;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        return lastDotIndex == -1 ? "" : fileName.substring(lastDotIndex + 1);
    }
}
