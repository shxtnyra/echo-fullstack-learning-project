package org.example.echo.service;

import lombok.RequiredArgsConstructor;
import org.example.echo.dto.source.SourceCreateRequest;
import org.example.echo.dto.source.SourceResponse;
import org.example.echo.dto.source.SourceUpdateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.entity.Source;
import org.example.echo.entity.Track;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.example.echo.mapper.SourceMapper;
import org.example.echo.mapper.TrackMapper;
import org.example.echo.repository.SourceRepository;
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
public class SourceService {
    private final SourceRepository sourceRepository;
    private final TrackRepository trackRepository;
    private final StorageService storageService;

    public SourceResponse createSource(SourceCreateRequest request) {
        if (sourceRepository.existsByName(request.name()))
            throw new EntityNotFoundException("Source", request.name());

        Source source = Source.builder()
                .name(request.name())
                .build();

        return SourceMapper.toResponse(sourceRepository.save(source));
    }

    public Page<SourceResponse> getAllSource(Pageable pageable) {
        return sourceRepository.findAll(pageable)
                .map(SourceMapper::toResponse);
    }

    public Page<TrackResponse> getSourceTracks(Long id, Pageable pageable) {
        if (!sourceRepository.existsById(id))
            throw new EntityNotFoundException("Source", id);

        return trackRepository.findBySourceId(id, pageable)
                .map(TrackMapper::toResponse);
    }

    public SourceResponse getSourceById(Long id) {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Source", id));

        return SourceMapper.toResponse(source);
    }

    public List<SourceResponse> searchSourceByName(String q) {
        return sourceRepository.searchByName(q).stream().map(SourceMapper::toResponse).toList();
    }

    public Resource downloadSourceAsZip(Long id) {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Source", id));

        List<String> filePath = trackRepository.findBySourceId(id)
                .stream()
                .map(Track::getAudioUrl)
                .toList();

        return storageService.loadFilesAsZip(filePath, source.getName().replaceAll("\\s+", "_"));
    }

    @Transactional
    public SourceResponse updateSource(Long id, SourceUpdateRequest request) {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Source", id));

        if (sourceRepository.existsByName(request.name()))
            throw new EntityNotFoundException("Source", request.name());

        source.setName(request.name());

        return SourceMapper.toResponse(sourceRepository.save(source));
    }

    public void deleteSource(Long id) {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Source", id));

        sourceRepository.delete(source);
    }
}
