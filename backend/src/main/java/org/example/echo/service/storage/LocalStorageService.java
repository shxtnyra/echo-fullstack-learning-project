package org.example.echo.service.storage;

import jakarta.annotation.PostConstruct;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class LocalStorageService implements StorageService{
    @Value("${local-storage.path:upload}")
    private String basePath;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(basePath));
        } catch (IOException e) {
            throw new RuntimeException("Failed to create storage directory", e);
        }
    }

    @Override
    public String saveFile(MultipartFile file, String filePath) throws FileAlreadyExistsException {
        Path fullPath = Paths.get(basePath, filePath);

        try {
            Files.createDirectories(fullPath.getParent());
            Files.copy(file.getInputStream(), fullPath);

            return filePath;
        } catch (FileAlreadyExistsException e) {
            throw new FileAlreadyExistsException("File already exists: " + filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Resource loadFile(String filePath) {
        Path fullPath = Paths.get(basePath, filePath);

        try {
            return new UrlResource(fullPath.toUri());
        } catch (Exception e) {
            throw new EntityNotFoundException("File", "filePath");
        }
    }

    @Override
    public void deleteFile(String filePath) {
        Path fullPath = Paths.get(basePath, filePath);

        try {
            Files.deleteIfExists(fullPath);
        } catch (IOException e) {
            throw new EntityNotFoundException("File", "filePath");
        }
    }

    @Override
    public Resource loadFilesAsZip(List<String> filePaths, String zipName) {
        try {
            Path tempFile = Files.createTempFile(zipName, ".zip");

            try (ZipOutputStream zipOut = new ZipOutputStream(Files.newOutputStream(tempFile))) {
                for (String path : filePaths) {
                    Path fullPath = Paths.get(basePath, path);
                    if (!Files.exists(fullPath)) continue; // если файла нет — пропускаем

                    ZipEntry zipEntry = new ZipEntry(Paths.get(path).getFileName().toString());
                    zipOut.putNextEntry(zipEntry);
                    Files.copy(fullPath, zipOut);
                    zipOut.closeEntry();
                }
            }

            return new UrlResource(tempFile.toUri());
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при создании ZIP архива", e);
        }
    }
}
