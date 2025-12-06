package org.example.echo.service;

import lombok.RequiredArgsConstructor;
import org.example.echo.dto.track.TrackCreateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.entity.*;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.example.echo.mapper.TrackMapper;
import org.example.echo.repository.*;
import org.example.echo.service.storage.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackService {
    private final ImageFileService imageFileService;
    private final AudioFileService audioFileService;
    private final StorageService storageService;

    private final TrackRepository trackRepository;
    private final ArtistRepository artistRepository;
    private final SourceRepository sourceRepository;
    private final AlbumRepository albumRepository;
    private final TagRepository tagRepository;

    public TrackResponse createTrack(MultipartFile audioFile, MultipartFile coverFile, TrackCreateRequest request) {
        Track track = new Track();

        track.setTitle(request.title());

        if (request.artistId() != null) {
            Artist artist = artistRepository.findById(request.artistId())
                    .orElseThrow(() -> new EntityNotFoundException("Artist", request.artistId()));
            track.setArtist(artist);
        }

        if (request.sourceId() != null) {
            Source source = sourceRepository.findById(request.sourceId())
                    .orElseThrow(() -> new EntityNotFoundException("Artist", request.artistId()));
            track.setSource(source);
        }

        if (request.albumId() != null) {
            Album album = albumRepository.findById(request.albumId())
                    .orElseThrow(() -> new EntityNotFoundException("Artist", request.artistId()));
            track.setAlbum(album);
        }

        if (!request.tagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.tagIds());
            track.setTags(tags);
        }

        if (coverFile != null) {
            String coverUrl = imageFileService.saveImage(coverFile);
            track.setCoverUrl(coverUrl);
        }

        // Тут немного не ясно но так же меняется поле duration в track
        String audioUrl = audioFileService.saveAudio(audioFile, coverFile, track);
        track.setAudioUrl(audioUrl);

        return TrackMapper.toResponse(trackRepository.save(track));
    }

    public Page<TrackResponse> getAllTrack(Pageable pageable) {
        return trackRepository.findAll(pageable)
                .map(TrackMapper::toResponse);
    }

    public Resource downloadAllTrackAsZip() {
        List<String> filePaths = trackRepository.findAll()
                .stream()
                .map(Track::getAudioUrl)
                .toList();

        return storageService.loadFilesAsZip(filePaths, "ALL");
    }
}
