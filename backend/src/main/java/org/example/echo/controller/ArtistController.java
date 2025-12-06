package org.example.echo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.echo.dto.album.AlbumResponse;
import org.example.echo.dto.artist.ArtistCreateRequest;
import org.example.echo.dto.artist.ArtistResponse;
import org.example.echo.dto.artist.ArtistUpdateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.service.ArtistService;
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
@RequestMapping("api/v1/artists")
public class ArtistController {
    private final ArtistService artistService;

    @PostMapping()
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<ArtistResponse> createArtist(@RequestBody @Valid ArtistCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(artistService.createArtist(request));
    }

    @GetMapping()
    public ResponseEntity<Page<ArtistResponse>> getPageArtists(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(artistService.getAllArtists(PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponse> getArtistById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(artistService.getArtistById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ArtistResponse>> searchArtistByName(@RequestParam("q") String q) {
        return ResponseEntity.ok(artistService.searchArtistByName(q));
    }

    @GetMapping("/{id}/albums")
    public ResponseEntity<Page<AlbumResponse>> getArtistAlbums(
            @PathVariable("id") Long id,
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(artistService.getArtistAlbums(id, PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}/tracks")
    public ResponseEntity<Page<TrackResponse>> getArtistTracks(
            @PathVariable("id") Long id,
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(artistService.getArtistTracks(id, PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadArtistTrack(@PathVariable Long id) {
        Resource zip = artistService.downloadArtistAsZip(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zip.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zip);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<Void> deleteArtist(@PathVariable("id") Long id) {
        artistService.deleteArtist(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<ArtistResponse> updateArtist(
            @PathVariable("id") Long id,
            @RequestBody @Valid ArtistUpdateRequest request) {
        return ResponseEntity.ok(artistService.updateArtist(id, request));
    }
}
