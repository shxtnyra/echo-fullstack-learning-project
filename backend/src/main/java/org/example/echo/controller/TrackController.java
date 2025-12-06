package org.example.echo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.echo.dto.track.TrackCreateRequest;
import org.example.echo.dto.track.TrackResponse;
import org.example.echo.service.TrackService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tracks")
public class TrackController {
    private final TrackService trackService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<TrackResponse> createTrack(@RequestPart @Valid TrackCreateRequest request,
                                                     @RequestPart MultipartFile audioFile,
                                                     @RequestPart(required = false) MultipartFile coverFile) {
        TrackResponse response = trackService.createTrack(audioFile, coverFile, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<TrackResponse>> getPageTrack(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(trackService.getAllTrack(PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/all-download")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<Resource> downloadAllTrack() {
        Resource zip = trackService.downloadAllTrackAsZip();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zip.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zip);
    }
}
