package com.transcendence.payment.repository;

import com.transcendence.payment.entity.TokenLedger;
import com.transcendence.payment.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenLedgerRepository extends JpaRepository<TokenLedger, Long> {

    Page<TokenLedger> findByFromUserIdOrToUserIdOrderByCreatedAtDesc(Long fromUserId, Long toUserId, Pageable pageable);

    List<TokenLedger> findByTaskId(Long taskId);

    Page<TokenLedger> findByTxType(TransactionType txType, Pageable pageable);

    @Query("SELECT t FROM TokenLedger t WHERE (t.fromUser.id = :userId OR t.toUser.id = :userId) ORDER BY t.createdAt DESC")
    Page<TokenLedger> findUserTransactions(@Param("userId") Long userId, Pageable pageable);

    List<TokenLedger> findByChainTxHash(String chainTxHash);
}
