package com.transcendence.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserProfileRequest {

    private String fullName;

    @NotBlank(message = "Country is required")
    private String country;

    private String phone;

    private String address;

    private String avatarUrl;
}
