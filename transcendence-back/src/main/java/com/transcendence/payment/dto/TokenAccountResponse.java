package com.transcendence.payment.dto;

import com.transcendence.payment.entity.TokenAccount;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TokenAccountResponse {

    private Long userId;
    private BigDecimal availableBalance;
    private BigDecimal lockedBalance;
    private BigDecimal totalBalance;
    private LocalDateTime updatedAt;

    public static TokenAccountResponse fromEntity(TokenAccount account) {
        return TokenAccountResponse.builder()
                .userId(account.getUserId())
                .availableBalance(account.getAvailableBalance())
                .lockedBalance(account.getLockedBalance())
                .totalBalance(account.getAvailableBalance().add(account.getLockedBalance()))
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
