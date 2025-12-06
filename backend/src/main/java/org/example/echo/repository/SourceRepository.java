package org.example.echo.repository;

import org.example.echo.entity.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SourceRepository extends JpaRepository<Source, Long> {
    @Query(value = "SELECT EXISTS(SELECT 1 FROM sources WHERE name = :name)", nativeQuery = true)
    boolean existsByName(@Param("name") String name);

    @Query(value = "SELECT * FROM sources WHERE LOWER(name) LIKE LOWER(CONCAT('%', :q, '%')) LIMIT 5", nativeQuery = true)
    List<Source> searchByName(@Param("q") String q);
}
