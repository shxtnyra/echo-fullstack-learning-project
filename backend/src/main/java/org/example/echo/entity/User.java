package org.example.echo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.echo.enums.Role;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column
    private String avatarUrl;

    @Builder.Default
    private Role role = Role.ROLE_USER;
}
