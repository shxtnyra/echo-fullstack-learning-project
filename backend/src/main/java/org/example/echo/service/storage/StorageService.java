package org.example.echo.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.FileAlreadyExistsException;
import java.util.List;

public interface StorageService {

    /**
     * Сохранить файл
     * @param file файл для сохранения
     * @return уникальный идентификатор файла
     */
    String saveFile(MultipartFile file, String filePath) throws FileAlreadyExistsException;

    /**
     * Загрузить файл как InputStream
     *
     * @param fileId идентификатор файла
     * @return InputStream файла
     */
    Resource loadFile(String fileId);

    /**
     * Удалить файл
     * @param fileId идентификатор файла
     */
    void deleteFile(String fileId);

    /**
     * Сформировать ZIP-архив из нескольких файлов и вернуть как ресурс.
     */
    Resource loadFilesAsZip(List<String> filePaths, String zipName);
}
