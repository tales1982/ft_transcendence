package com.transcendence.payment.controller;

import com.transcendence.payment.dto.DepositRequest;
import com.transcendence.payment.dto.TokenAccountResponse;
import com.transcendence.payment.dto.WithdrawRequest;
import com.transcendence.payment.service.TokenAccountService;
import com.transcendence.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class TokenAccountController {

    private final TokenAccountService accountService;

    @GetMapping
    public ResponseEntity<TokenAccountResponse> getMyAccount(@AuthenticationPrincipal User user) {
        var account = accountService.getOrCreateAccount(user.getId());
        return ResponseEntity.ok(TokenAccountResponse.fromEntity(account));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<TokenAccountResponse> getAccount(@PathVariable Long userId) {
        return accountService.getAccount(userId)
                .map(TokenAccountResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/deposit")
    public ResponseEntity<TokenAccountResponse> deposit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DepositRequest request) {
        var account = accountService.deposit(user.getId(), request.getAmount(), request.getChainTxHash());
        return ResponseEntity.ok(TokenAccountResponse.fromEntity(account));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TokenAccountResponse> withdraw(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody WithdrawRequest request) {
        var account = accountService.withdraw(user.getId(), request.getAmount(), null);
        return ResponseEntity.ok(TokenAccountResponse.fromEntity(account));
    }
}
