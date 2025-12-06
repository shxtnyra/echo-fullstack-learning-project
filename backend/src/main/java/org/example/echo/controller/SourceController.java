package org.example.echo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.echo.dto.source.SourceCreateRequest;
import org.example.echo.dto.source.SourceResponse;
import org.example.echo.dto.source.SourceUpdateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.service.SourceService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/sources")
public class SourceController {
    private final SourceService sourceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<SourceResponse> createSource(@RequestBody @Valid SourceCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sourceService.createSource(request));
    }

    @GetMapping()
    public ResponseEntity<Page<SourceResponse>> getPageSources(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(sourceService.getAllSource(PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SourceResponse> getSourceById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(sourceService.getSourceById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SourceResponse>> searchSourceByName(@RequestParam("q") String q) {
        return ResponseEntity.ok(sourceService.searchSourceByName(q));
    }

    @GetMapping("/{id}/tracks")
    public ResponseEntity<Page<TrackResponse>> getSourceTracks(
            @PathVariable("id") Long id,
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(sourceService.getSourceTracks(id, PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadSourceTrack(@PathVariable("id") Long id) {
        Resource zip = sourceService.downloadSourceAsZip(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zip.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zip);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<Void> deleteSource(@PathVariable("id") Long id) {
        sourceService.deleteSource(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<SourceResponse> updateSource(
            @PathVariable("id") Long id,
            @RequestBody @Valid SourceUpdateRequest request) {
        return ResponseEntity.ok(sourceService.updateSource(id, request));
    }
}
