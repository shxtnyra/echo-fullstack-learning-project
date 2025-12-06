package org.example.echo.service;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.example.echo.entity.Track;
import org.example.echo.service.storage.StorageService;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.tag.FieldDataInvalidException;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.datatype.Artwork;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AudioFileService {
    private final StorageService storageService;
    private final ImageFileService imageFileService;


    @Value("${storage.audio-bucket:audio}")
    private String audioBucketName;

    private final int MAX_GENERATION_NAME_RETRY = 2;

    private final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".mp4", ".mp3"
    );

    public String saveAudio(MultipartFile audio, MultipartFile cover, Track trackInfo) {
        validateAudioFile(audio);
        String extension = getValidatedExtension(audio.getOriginalFilename());

        try {
            String fileName = generateReadablyAudioName(trackInfo, extension);
            String fullPath = buildFilePath(fileName);

            MultipartFile newAudio = updateAudioMetadataFile(audio, cover, trackInfo, extension);

            return storageService.saveFile(newAudio, fullPath);

        }catch (FileAlreadyExistsException e) {
            throw new IllegalArgumentException("ТРЕК С АБСОЛЮТНО ТАКИМИ ЖЕ ПАРАМЕТРАМИ УЖЕ ЕСТЬ");
        }
    }

    private MultipartFile updateAudioMetadataFile(MultipartFile audio, MultipartFile cover, Track trackInfo, String extension) {
        File tempAudio;

        try {
            tempAudio = File.createTempFile("audio_", extension);
            audio.transferTo(tempAudio);

            AudioFile audioFile = AudioFileIO.read(tempAudio);
            // Получаем длительность из файла
            int duration = audioFile.getAudioHeader().getTrackLength();
            trackInfo.setDuration(duration);

            Tag tag = audioFile.getTagOrCreateAndSetDefault();

            if (cover != null && !cover.isEmpty()) {
                setPreview(tag, cover);
            }

            setMetadata(tag, trackInfo);
            audioFile.commit();

            return getMultipartFile(audio, tempAudio);

        } catch (Exception e) {
            return audio;
        }
    }

    private static MultipartFile getMultipartFile(MultipartFile audio, File tempAudio) {
        return new MultipartFile() {
            @Override
            public String getName() {
                return audio.getName();
            }

            @Override
            public String getOriginalFilename() {
                return audio.getOriginalFilename();
            }

            @Override
            public String getContentType() {
                return audio.getContentType();
            }

            @Override
            public boolean isEmpty() {
                return tempAudio.length() == 0;
            }

            @Override
            public long getSize() {
                return tempAudio.length();
            }

            @Override
            public byte[] getBytes() throws IOException {
                return Files.readAllBytes(tempAudio.toPath());
            }

            @Override
            public InputStream getInputStream() throws IOException {
                return new FileInputStream(tempAudio);
            }

            @Override
            public void transferTo(File dest) throws IOException {
                Files.copy(tempAudio.toPath(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING);
                tempAudio.delete();
            }
        };
    }

    private void setPreview(Tag tag, MultipartFile cover) {
        File tempCover = null;
        try {
            tempCover = File.createTempFile("cover_", ".jpeg");
            cover.transferTo(tempCover);

            Artwork artwork = Artwork.createArtworkFromFile(tempCover);
            tag.deleteArtworkField();
            tag.setField(artwork);
        } catch (Exception e) {
            System.err.println("Failed to process cover: " + e.getMessage());
        } finally {
            if (tempCover != null)
                tempCover.delete();
        }
    }

    private void setMetadata(Tag tag, Track trackInfo) throws FieldDataInvalidException {
        if (trackInfo.getArtist() != null) {
            tag.setField(FieldKey.ARTIST, trackInfo.getArtist().getName());
        } else if (trackInfo.getSource() != null) {
            tag.setField(FieldKey.ARTIST, trackInfo.getSource().getName());
        }

        if (trackInfo.getSource() != null) {
            tag.setField(FieldKey.ALBUM, trackInfo.getSource().getName());
        } else if (trackInfo.getAlbum() != null) {
            tag.setField(FieldKey.ALBUM, trackInfo.getAlbum().getTitle());
        }

        tag.setField(FieldKey.TITLE, trackInfo.getTitle());
    }

    private String buildFilePath(String fileName) {
        return audioBucketName + "/" + fileName;
    }

    private String generateReadablyAudioName(Track trackInfo, String extension) {
        StringBuilder sb = new StringBuilder();

        if (trackInfo.getSource() != null) {
            sb.append(trackInfo.getSource().getName());
            sb.append(" OST");
        }
        else if (trackInfo.getArtist() != null)
            sb.append(trackInfo.getArtist().getName());
        else {
            sb.append("НЕИЗВЕСТЕН");
        }

        sb.append(" - ");

        sb.append(trackInfo.getTitle());
        sb.append(extension);
        return sb.toString();
    }

    private String getValidatedExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.trim().isEmpty())
            throw new ValidationException("Filename cannot be null or empty");

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ValidationException("Unsupported file extension: " + extension +
                    ". Allowed: " + ALLOWED_EXTENSIONS);
        }

        return extension;
    }

    private void validateAudioFile(MultipartFile file) {
        if (file == null)
            throw new ValidationException("Audio file cannot be null");

        if (file.isEmpty())
            throw new ValidationException("Audio file cannot be empty");

        if (file.getSize() > 30 * 1024 * 1024) {
            throw new ValidationException("Audio file size too large. Maximum 30MB allowed");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("audio/")) {
            throw new ValidationException("Audio file must be audio");
        }
    }
}
