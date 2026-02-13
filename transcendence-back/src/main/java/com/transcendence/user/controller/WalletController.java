package com.transcendence.user.controller;

import com.transcendence.user.dto.WalletRequest;
import com.transcendence.user.dto.WalletResponse;
import com.transcendence.user.entity.User;
import com.transcendence.user.service.UserWalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
@Tag(name = "Carteiras", description = "Gerenciamento de carteiras crypto")
public class WalletController {

    private final UserWalletService walletService;

    @GetMapping
    @Operation(summary = "Minhas carteiras", description = "Lista todas as carteiras do usuario")
    public ResponseEntity<List<WalletResponse>> getMyWallets(@AuthenticationPrincipal User user) {
        var wallets = walletService.getUserWallets(user.getId())
                .stream()
                .map(WalletResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(wallets);
    }

    @GetMapping("/primary")
    @Operation(summary = "Carteira principal", description = "Retorna a carteira principal do usuario")
    public ResponseEntity<WalletResponse> getPrimaryWallet(@AuthenticationPrincipal User user) {
        return walletService.getPrimaryWallet(user.getId())
                .map(WalletResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Conectar carteira", description = "Conecta uma nova carteira ao usuario")
    public ResponseEntity<WalletResponse> connectWallet(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody WalletRequest request) {
        var wallet = walletService.connectWallet(
                user.getId(),
                request.getChainId(),
                request.getAddress(),
                request.getIsPrimary()
        );
        return ResponseEntity.ok(WalletResponse.fromEntity(wallet));
    }

    @DeleteMapping("/{walletId}")
    @Operation(summary = "Desconectar carteira", description = "Remove a carteira do usuario")
    public ResponseEntity<Void> disconnectWallet(
            @AuthenticationPrincipal User user,
            @PathVariable Long walletId) {
        walletService.disconnectWallet(walletId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{walletId}/primary")
    @Operation(summary = "Definir carteira principal", description = "Define uma carteira como principal")
    public ResponseEntity<WalletResponse> setPrimaryWallet(
            @AuthenticationPrincipal User user,
            @PathVariable Long walletId) {
        var wallet = walletService.setPrimaryWallet(walletId, user.getId());
        return ResponseEntity.ok(WalletResponse.fromEntity(wallet));
    }
}
