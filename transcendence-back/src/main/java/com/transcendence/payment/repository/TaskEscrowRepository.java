package com.transcendence.payment.repository;

import com.transcendence.payment.entity.EscrowStatus;
import com.transcendence.payment.entity.TaskEscrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskEscrowRepository extends JpaRepository<TaskEscrow, Long> {

    List<TaskEscrow> findByStatus(EscrowStatus status);

    boolean existsByTaskIdAndStatus(Long taskId, EscrowStatus status);
}
