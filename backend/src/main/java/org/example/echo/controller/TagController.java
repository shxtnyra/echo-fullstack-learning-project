package org.example.echo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.echo.dto.tag.TagCreateRequest;
import org.example.echo.dto.tag.TagResponse;
import org.example.echo.dto.tag.TagUpdateRequest;
import org.example.echo.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tags")
public class TagController {
    private final TagService tagService;

    @PostMapping()
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<TagResponse> createTag(@RequestBody @Valid TagCreateRequest request) {
        TagResponse tagResponse = tagService.createTag(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tagResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> getTagById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.getTagById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TagResponse>> searchTagByName(@RequestParam("q") String q) {
        return ResponseEntity.ok(tagService.searchTagByName(q));
    }

    @GetMapping("/random")
    public ResponseEntity<List<TagResponse>> getRandomTags(@RequestParam(defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(tagService.getRandomTags(size));
    }

    @GetMapping("/first")
    public ResponseEntity<List<TagResponse>> getFirstTags(@RequestParam(defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;
        return ResponseEntity.ok(tagService.getFirstTags(size));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<TagResponse> updateTag(
            @PathVariable Long id,
            @RequestBody @Valid TagUpdateRequest request) {
        return ResponseEntity.ok(tagService.updateTag(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }
}
