package org.example.echo.repository;

import org.example.echo.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    @Query(value = "SELECT EXISTS(SELECT 1 FROM artists WHERE name = :name)", nativeQuery = true)
    boolean existsByName(@Param("name") String name);

    @Query(value = "SELECT * FROM artists WHERE LOWER(name) LIKE LOWER(CONCAT('%', :q, '%')) LIMIT 5", nativeQuery = true)
    List<Artist> searchByName(@Param("q") String q);
}
