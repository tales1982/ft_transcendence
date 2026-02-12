package com.transcendence.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Long categoryId;

    @PositiveOrZero(message = "Reward amount must be positive or zero")
    private BigDecimal rewardAmount;

    private String locationText;

    private LocalDateTime deadlineAt;

    private Set<String> tags;
}
