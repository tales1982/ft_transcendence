package com.transcendence.user.dto;

import com.transcendence.user.entity.UserProfile;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileResponse {

    private Long userId;
    private String fullName;
    private String country;
    private String phone;
    private String address;
    private String avatarUrl;
    private LocalDateTime updatedAt;

    public static UserProfileResponse fromEntity(UserProfile profile) {
        return UserProfileResponse.builder()
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .country(profile.getCountry())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .avatarUrl(profile.getAvatarUrl())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
