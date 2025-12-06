package org.example.echo.repository;

import org.example.echo.dto.tag.TagResponse;
import org.example.echo.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query(value = "SELECT EXISTS(SELECT 1 FROM tags WHERE name = :name)", nativeQuery = true)
    boolean existsByName(@Param("name") String name);

    @Query(value = "SELECT * FROM tags ORDER BY RANDOM() LIMIT :size", nativeQuery = true)
    List<Tag> getRandomTags(@Param("size") int size);

    @Query(value = "SELECT * FROM tags ORDER BY id LIMIT :size", nativeQuery = true)
    List<Tag> getFirstTags(@Param("size") int size);

    @Query(value = "SELECT * FROM tags WHERE LOWER(name) LIKE LOWER(CONCAT('%', :q, '%')) LIMIT 5", nativeQuery = true)
    List<Tag> searchByName(@Param(("q")) String q);
}
