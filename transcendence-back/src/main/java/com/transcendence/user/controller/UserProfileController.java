package com.transcendence.user.controller;

import com.transcendence.user.dto.UserProfileRequest;
import com.transcendence.user.dto.UserProfileResponse;
import com.transcendence.user.entity.User;
import com.transcendence.user.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService profileService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal User user) {
        return profileService.getProfile(user.getId())
                .map(UserProfileResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable Long userId) {
        return profileService.getProfile(userId)
                .map(UserProfileResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
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
