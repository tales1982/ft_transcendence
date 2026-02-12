package com.transcendence.user.dto;

import com.transcendence.user.entity.UserWallet;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WalletResponse {

    private Long id;
    private Long userId;
    private Integer chainId;
    private String address;
    private Boolean isPrimary;
    private LocalDateTime connectedAt;
    private LocalDateTime disconnectedAt;

    public static WalletResponse fromEntity(UserWallet wallet) {
        return WalletResponse.builder()
                .id(wallet.getId())
                .userId(wallet.getUser().getId())
                .chainId(wallet.getChainId())
                .address(wallet.getAddress())
                .isPrimary(wallet.getIsPrimary())
                .connectedAt(wallet.getConnectedAt())
                .disconnectedAt(wallet.getDisconnectedAt())
                .build();
    }
}
