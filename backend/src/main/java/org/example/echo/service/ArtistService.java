package org.example.echo.service;

import lombok.RequiredArgsConstructor;
import org.example.echo.dto.album.AlbumResponse;
import org.example.echo.dto.artist.ArtistCreateRequest;
import org.example.echo.dto.artist.ArtistResponse;
import org.example.echo.dto.artist.ArtistUpdateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.entity.Artist;
import org.example.echo.entity.Track;
import org.example.echo.exception.custom.EntityAlreadyExistsException;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.example.echo.mapper.AlbumMapper;
import org.example.echo.mapper.ArtistMapper;
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
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;
    private final StorageService storageService;

    public ArtistResponse createArtist(ArtistCreateRequest request) {
        if (artistRepository.existsByName(request.name()))
            throw new EntityAlreadyExistsException("Artist", request.name());

        Artist artist = Artist
                .builder()
                .name(request.name())
                .build();

        return ArtistMapper.toResponse(artistRepository.save(artist));
    }

    public Page<ArtistResponse> getAllArtists(Pageable pageable) {
        return artistRepository.findAll(pageable)
                .map(ArtistMapper::toResponse);
    }

    public ArtistResponse getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist", id));

        return ArtistMapper.toResponse(artist);
    }

    public Page<TrackResponse> getArtistTracks(Long id, Pageable pageable) {
        if (!artistRepository.existsById(id)) {
            throw new EntityNotFoundException("Artist", id);
        }

        return trackRepository.findByArtistId(id, pageable)
                .map(TrackMapper::toResponse);
    }

    public Page<AlbumResponse> getArtistAlbums(Long id, Pageable pageable) {
        if (!artistRepository.existsById(id)) {
            throw new EntityNotFoundException("Artist", id);
        }

        return albumRepository.findByArtistId(id, pageable)
                .map(AlbumMapper::toResponse);
    }

    public List<ArtistResponse> searchArtistByName(String q) {
        return artistRepository.searchByName(q).stream().map(ArtistMapper::toResponse).toList();
    }

    public Resource downloadArtistAsZip(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist", id));

        List<String> filePaths = trackRepository.findByArtistId(id)
                .stream()
                .map(Track::getAudioUrl)
                .toList();

        return storageService.loadFilesAsZip(filePaths, artist.getName().replaceAll("\\s+", "_"));
    }

    @Transactional
    public ArtistResponse updateArtist(Long id, ArtistUpdateRequest request) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist", id));

        if (artistRepository.existsByName(request.name()))
            throw new EntityAlreadyExistsException("Artist", request.name());

        artist.setName(request.name());

        return ArtistMapper.toResponse(artistRepository.save(artist));
    }

    @Transactional
    public void deleteArtist(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artist", id));

        artistRepository.delete(artist);
    }
}
