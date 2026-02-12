package com.transcendence.payment.repository;

import com.transcendence.payment.entity.TokenAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface TokenAccountRepository extends JpaRepository<TokenAccount, Long> {

    @Modifying
    @Query("UPDATE TokenAccount t SET t.availableBalance = t.availableBalance + :amount, t.updatedAt = CURRENT_TIMESTAMP WHERE t.userId = :userId")
    int addToAvailableBalance(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("UPDATE TokenAccount t SET t.availableBalance = t.availableBalance - :amount, t.lockedBalance = t.lockedBalance + :amount, t.updatedAt = CURRENT_TIMESTAMP WHERE t.userId = :userId AND t.availableBalance >= :amount")
    int lockBalance(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("UPDATE TokenAccount t SET t.lockedBalance = t.lockedBalance - :amount, t.updatedAt = CURRENT_TIMESTAMP WHERE t.userId = :userId AND t.lockedBalance >= :amount")
    int releaseLockedBalance(@Param("userId") Long userId, @Param("amount") BigDecimal amount);
}
