package com.transcendence.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WalletRequest {

    @NotNull(message = "Chain ID is required")
    private Integer chainId;

    @NotBlank(message = "Wallet address is required")
    private String address;

    private Boolean isPrimary = false;
}
