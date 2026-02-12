package com.transcendence.user.service;

import com.transcendence.user.entity.User;
import com.transcendence.user.entity.UserWallet;
import com.transcendence.user.repository.UserRepository;
import com.transcendence.user.repository.UserWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserWalletService {

    private final UserWalletRepository walletRepository;
    private final UserRepository userRepository;

    public List<UserWallet> getUserWallets(Long userId) {
        return walletRepository.findByUserId(userId);
    }

    public Optional<UserWallet> getPrimaryWallet(Long userId) {
        return walletRepository.findByUserIdAndIsPrimaryTrue(userId);
    }

    @Transactional
    public UserWallet connectWallet(Long userId, Integer chainId, String address, boolean isPrimary) {
        if (walletRepository.existsByChainIdAndAddress(chainId, address)) {
            throw new RuntimeException("Wallet already connected to another account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (isPrimary) {
            walletRepository.findByUserIdAndIsPrimaryTrue(userId)
                    .ifPresent(wallet -> {
                        wallet.setIsPrimary(false);
                        walletRepository.save(wallet);
                    });
        }

        UserWallet wallet = UserWallet.builder()
                .user(user)
                .chainId(chainId)
                .address(address)
                .isPrimary(isPrimary)
                .build();

        return walletRepository.save(wallet);
    }

    @Transactional
    public void disconnectWallet(Long walletId, Long userId) {
        UserWallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (!wallet.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to disconnect this wallet");
        }

        wallet.setDisconnectedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    @Transactional
    public UserWallet setPrimaryWallet(Long walletId, Long userId) {
        UserWallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (!wallet.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        walletRepository.findByUserIdAndIsPrimaryTrue(userId)
                .ifPresent(w -> {
                    w.setIsPrimary(false);
                    walletRepository.save(w);
                });

        wallet.setIsPrimary(true);
        return walletRepository.save(wallet);
    }
}
