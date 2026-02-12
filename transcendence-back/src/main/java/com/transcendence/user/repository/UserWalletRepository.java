package com.transcendence.user.repository;

import com.transcendence.user.entity.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWalletRepository extends JpaRepository<UserWallet, Long> {

    List<UserWallet> findByUserId(Long userId);

    Optional<UserWallet> findByChainIdAndAddress(Integer chainId, String address);

    Optional<UserWallet> findByUserIdAndIsPrimaryTrue(Long userId);

    boolean existsByChainIdAndAddress(Integer chainId, String address);
}
