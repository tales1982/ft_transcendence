package com.transcendence.user.controller;

import com.transcendence.user.dto.UserProfileRequest;
import com.transcendence.user.dto.UserProfileResponse;
import com.transcendence.user.entity.User;
import com.transcendence.user.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Perfil", description = "Gerenciamento de perfil do usuario")
public class UserProfileController {

    private final UserProfileService profileService;

    @GetMapping
    @Operation(summary = "Meu perfil", description = "Retorna o perfil do usuario autenticado")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal User user) {
        return profileService.getProfile(user.getId())
                .map(UserProfileResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Buscar perfil por ID", description = "Retorna o perfil de um usuario especifico")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable Long userId) {
        return profileService.getProfile(userId)
                .map(UserProfileResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    @Operation(summary = "Atualizar meu perfil", description = "Atualiza o perfil do usuario autenticado")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request) {
        var profile = profileService.createOrUpdateProfile(
                user.getId(),
                request.getFullName(),
                request.getCountry(),
                request.getPhone(),
                request.getAddress(),
                request.getAvatarUrl()
        );
        return ResponseEntity.ok(UserProfileResponse.fromEntity(profile));
    }
}
