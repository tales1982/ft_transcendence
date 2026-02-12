package com.transcendence.payment.service;

import com.transcendence.payment.entity.TokenAccount;
import com.transcendence.payment.entity.TokenLedger;
import com.transcendence.payment.entity.TransactionType;
import com.transcendence.payment.repository.TokenAccountRepository;
import com.transcendence.payment.repository.TokenLedgerRepository;
import com.transcendence.user.entity.User;
import com.transcendence.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenAccountService {

    private final TokenAccountRepository accountRepository;
    private final TokenLedgerRepository ledgerRepository;
    private final UserRepository userRepository;

    public Optional<TokenAccount> getAccount(Long userId) {
        return accountRepository.findById(userId);
    }

    @Transactional
    public TokenAccount getOrCreateAccount(Long userId) {
        return accountRepository.findById(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    TokenAccount account = TokenAccount.builder()
                            .user(user)
                            .availableBalance(BigDecimal.ZERO)
                            .lockedBalance(BigDecimal.ZERO)
                            .build();
                    return accountRepository.save(account);
                });
    }

    @Transactional
    public TokenAccount deposit(Long userId, BigDecimal amount, String chainTxHash) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        TokenAccount account = getOrCreateAccount(userId);
        account.setAvailableBalance(account.getAvailableBalance().add(amount));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TokenLedger ledger = TokenLedger.builder()
                .txType(TransactionType.DEPOSIT)
                .toUser(user)
                .amount(amount)
                .chainTxHash(chainTxHash)
                .build();

        ledgerRepository.save(ledger);
        return accountRepository.save(account);
    }

    @Transactional
    public TokenAccount withdraw(Long userId, BigDecimal amount, String chainTxHash) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        TokenAccount account = accountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getAvailableBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setAvailableBalance(account.getAvailableBalance().subtract(amount));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TokenLedger ledger = TokenLedger.builder()
                .txType(TransactionType.WITHDRAW)
                .fromUser(user)
                .amount(amount)
                .chainTxHash(chainTxHash)
                .build();

        ledgerRepository.save(ledger);
        return accountRepository.save(account);
    }

    @Transactional
    public void lockBalanceForTask(Long userId, BigDecimal amount, Long taskId) {
        TokenAccount account = accountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getAvailableBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setAvailableBalance(account.getAvailableBalance().subtract(amount));
        account.setLockedBalance(account.getLockedBalance().add(amount));
        accountRepository.save(account);
    }

    @Transactional
    public void releaseLockedBalance(Long fromUserId, Long toUserId, BigDecimal amount, Long taskId) {
        TokenAccount fromAccount = accountRepository.findById(fromUserId)
                .orElseThrow(() -> new RuntimeException("From account not found"));

        if (fromAccount.getLockedBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient locked balance");
        }

        fromAccount.setLockedBalance(fromAccount.getLockedBalance().subtract(amount));
        accountRepository.save(fromAccount);

        TokenAccount toAccount = getOrCreateAccount(toUserId);
        toAccount.setAvailableBalance(toAccount.getAvailableBalance().add(amount));
        accountRepository.save(toAccount);
    }

    @Transactional
    public void refundLockedBalance(Long userId, BigDecimal amount) {
        TokenAccount account = accountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getLockedBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient locked balance");
        }

        account.setLockedBalance(account.getLockedBalance().subtract(amount));
        account.setAvailableBalance(account.getAvailableBalance().add(amount));
        accountRepository.save(account);
    }
}
