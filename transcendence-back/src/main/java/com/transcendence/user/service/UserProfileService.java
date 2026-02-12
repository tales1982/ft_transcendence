package com.transcendence.user.service;

import com.transcendence.user.entity.User;
import com.transcendence.user.entity.UserProfile;
import com.transcendence.user.repository.UserProfileRepository;
import com.transcendence.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public Optional<UserProfile> getProfile(Long userId) {
        return userProfileRepository.findById(userId);
    }

    @Transactional
    public UserProfile createOrUpdateProfile(Long userId, String fullName, String country,
                                              String phone, String address, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(UserProfile.builder().user(user).build());

        profile.setFullName(fullName);
        profile.setCountry(country);
        profile.setPhone(phone);
        profile.setAddress(address);
        profile.setAvatarUrl(avatarUrl);

        return userProfileRepository.save(profile);
    }

    @Transactional
    public UserProfile updateAvatar(Long userId, String avatarUrl) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setAvatarUrl(avatarUrl);
        return userProfileRepository.save(profile);
    }
}
