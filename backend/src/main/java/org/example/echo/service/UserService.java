package org.example.echo.service;

import lombok.RequiredArgsConstructor;
import org.example.echo.dto.user.UserResponse;
import org.example.echo.dto.user.UserUpdateRequest;
import org.example.echo.entity.User;
import org.example.echo.enums.Role;
import org.example.echo.exception.custom.EntityNotFoundException;
import org.example.echo.mapper.UserMapper;
import org.example.echo.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ImageFileService imageFileService;

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User", id));

        return UserMapper.toResponse(user);
    }

    public Page<UserResponse> getAllUsers(PageRequest pageable) {
        return userRepository.findAll(pageable)
                .map(UserMapper::toResponse);
    }

    @Transactional
    public boolean giveModeratorRole(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User", id));

        user.setRole(Role.ROLE_MODERATOR);
        return true;
    }

    @Transactional
    public boolean deleteModeratorRole(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User", id));

        user.setRole(Role.ROLE_USER);
        return true;
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User", id));

        user.setUsername(request.username());

        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse setUserProfilePicture(Long id, MultipartFile avatarImage) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User", id));

        String avatarPath = imageFileService.saveImage(avatarImage);
        user.setAvatarUrl(avatarPath);

        return UserMapper.toResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User", id));

        userRepository.delete(user);
    }
}
