package org.example.echo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.echo.dto.album.AlbumCreateRequest;
import org.example.echo.dto.album.AlbumResponse;
import org.example.echo.dto.album.AlbumUpdateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.service.AlbumService;
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
@RequestMapping("api/v1/albums")
public class AlbumController {
    private final AlbumService albumService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<AlbumResponse> createAlbum(
            @RequestBody @Valid AlbumCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(albumService.createAlbum(request));
    }

    @GetMapping
    public ResponseEntity<Page<AlbumResponse>> getPageAlbums(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(albumService.getAllAlbums(PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlbumResponse> getAlbumById(@PathVariable Long id) {
        return ResponseEntity.ok(albumService.getAlbumById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AlbumResponse>> searchAlbumByTitle(@RequestParam("q") String q) {
        return ResponseEntity.ok(albumService.searchAlbum(q));
    }

    @GetMapping("/{id}/tracks")
    public ResponseEntity<Page<TrackResponse>> getAlbumTracks(
            @PathVariable Long id,
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(albumService.getAlbumTracks(id, PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadAlbumTrack(@PathVariable Long id) {
        Resource zip = albumService.downloadAlbumAsZip(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zip.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zip);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<AlbumResponse> updateAlbum(
            @PathVariable Long id,
            @RequestBody @Valid AlbumUpdateRequest request) {
        return ResponseEntity.ok(albumService.updateAlbum(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }
}

