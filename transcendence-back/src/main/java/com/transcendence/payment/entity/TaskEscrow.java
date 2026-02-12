package com.transcendence.payment.entity;

import com.transcendence.task.entity.Task;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "task_escrows")
public class TaskEscrow {

    @Id
    private Long taskId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "locked_amount", nullable = false, precision = 20, scale = 6)
    private BigDecimal lockedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EscrowStatus status = EscrowStatus.LOCKED;

    @Column(name = "locked_at", nullable = false)
    @Builder.Default
    private LocalDateTime lockedAt = LocalDateTime.now();

    @Column(name = "released_at")
    private LocalDateTime releasedAt;
}
