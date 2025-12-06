package org.example.echo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.echo.dto.user.UserResponse;
import org.example.echo.dto.user.UserUpdateRequest;
import org.example.echo.security.UserInfo;
import org.example.echo.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/{id}/promote-to-moderator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> giveModeratorRole(@PathVariable Long id) {
        boolean result = userService.giveModeratorRole(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/demote-to-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> deleteModeratorRole(@PathVariable Long id) {
        boolean result = userService.deleteModeratorRole(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getUsersPage(
            @RequestParam(value = "page", defaultValue = "0") int pageNumber,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        size = size > 30 ? 30 : size;

        return ResponseEntity.ok(userService.getAllUsers(PageRequest.of(pageNumber, size)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserUpdateRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/avatar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUserAvatar(
            @PathVariable Long id,
            @RequestParam("avatar") MultipartFile avatar) {
        UserResponse response = userService.setUserProfilePicture(id, avatar);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UserInfo currentUser = (UserInfo) authentication.getPrincipal();
        UserResponse response = userService.getUserById(currentUser.id());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<UserResponse> updateMyAvatar(
            Authentication authentication,
            @RequestPart("avatar") MultipartFile avatar) {

        UserResponse response = userService.setUserProfilePicture((Long) authentication.getPrincipal(), avatar);
        return ResponseEntity.ok(response);
    }
}
