package org.example.echo.service;

import lombok.RequiredArgsConstructor;
import org.example.echo.dto.source.SourceResponse;
import org.example.echo.dto.tag.TagCreateRequest;
import org.example.echo.dto.tag.TagResponse;
import org.example.echo.dto.tag.TagUpdateRequest;
import org.example.echo.entity.Tag;
import org.example.echo.exception.custom.EntityAlreadyExistsException;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.example.echo.mapper.TagMapper;
import org.example.echo.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public TagResponse createTag(TagCreateRequest request) {
        if (tagRepository.existsByName(request.name()))
            throw new EntityAlreadyExistsException("Tag", request.name());

        Tag tag = Tag.builder()
                .name(request.name())
                .build();

        return TagMapper.toResponse(tagRepository.save(tag));
    }

    public List<TagResponse> getAllTagsList() {
        return tagRepository.findAll().stream()
                .map(TagMapper::toResponse).toList();
    }

    public TagResponse getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag", id));

        return TagMapper.toResponse(tag);
    }

    @Transactional
    public TagResponse updateTag(Long id, TagUpdateRequest request) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag", id));

        tag.setName(request.name());

        return TagMapper.toResponse(tagRepository.save(tag));
    }

    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag", id));

        tagRepository.delete(tag);
    }

    public List<TagResponse> getRandomTags(int size) {
        return tagRepository.getRandomTags(size).stream().map(TagMapper::toResponse).toList();
    }

    public List<TagResponse> getFirstTags(int size) {
        return tagRepository.getFirstTags(size).stream().map(TagMapper::toResponse).toList();
    }

    public List<TagResponse> searchTagByName(String q) {
        return tagRepository.searchByName(q).stream().map(TagMapper::toResponse).toList();
    }
}
