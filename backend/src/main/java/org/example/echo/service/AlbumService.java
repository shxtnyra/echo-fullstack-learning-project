package org.example.echo.service;

import lombok.RequiredArgsConstructor;
import org.example.echo.dto.album.AlbumCreateRequest;
import org.example.echo.dto.album.AlbumResponse;
import org.example.echo.dto.album.AlbumUpdateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.entity.Album;
import org.example.echo.entity.Artist;
import org.example.echo.entity.Track;
import org.example.echo.exception.custom.EntityAlreadyExistsException;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.example.echo.mapper.AlbumMapper;
import org.example.echo.mapper.TrackMapper;
import org.example.echo.repository.AlbumRepository;
import org.example.echo.repository.ArtistRepository;
import org.example.echo.repository.TrackRepository;
import org.example.echo.service.storage.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final TrackRepository trackRepository;
    private final StorageService storageService;
    private final ArtistRepository artistRepository;

    public AlbumResponse createAlbum(AlbumCreateRequest request) {
        if (albumRepository.existsByTitle(request.title()))
            throw new EntityAlreadyExistsException("Album", request.title());

        Artist artist = artistRepository.findById(request.artistId())
                .orElseThrow(() -> new EntityNotFoundException("Artist", request.artistId()));

        Album album = Album.builder()
                .title(request.title())
                .artist(artist)
                .build();

        return AlbumMapper.toResponse(albumRepository.save(album));
    }

    public AlbumResponse getAlbumById(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Album", id));

        return AlbumMapper.toResponse(album);
    }

    public Page<AlbumResponse> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable)
                .map(AlbumMapper::toResponse);
    }

    public Resource downloadAlbumAsZip(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Album", id));

        List<String> filePaths = trackRepository.findByAlbumId(id)
                .stream()
                .map(Track::getAudioUrl)
                .toList();

        if (filePaths.isEmpty()) {
            throw new EntityNotFoundException("Track", id);
        }

        return storageService.loadFilesAsZip(filePaths, album.getTitle().replaceAll("\\s+", "_"));
    }

    public Page<TrackResponse> getAlbumTracks(Long id, Pageable pageable) {
        if (!albumRepository.existsById(id)) {
            throw new EntityNotFoundException("Artist", id);
        }

        return trackRepository.findByAlbumId(id, pageable)
                .map(TrackMapper::toResponse);
    }

    public List<AlbumResponse> searchAlbum(String q) {
        return albumRepository.searchByTitle(q);
    }

    @Transactional
    public AlbumResponse updateAlbum(Long id, AlbumUpdateRequest request) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist", id));

        if (albumRepository.existsByTitle(request.title()))
            throw new EntityAlreadyExistsException("Artist", request.title());

        album.setTitle(request.title());

        return AlbumMapper.toResponse(albumRepository.save(album));
    }

    @Transactional
    public void deleteAlbum(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist", id));

        albumRepository.delete(album);
    }
}
