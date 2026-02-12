package com.transcendence.task.dto;

import com.transcendence.task.entity.Task;
import com.transcendence.task.entity.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private BigDecimal rewardAmount;
    private String currency;
    private String locationText;
    private LocalDateTime deadlineAt;
    private Long creatorId;
    private String creatorEmail;
    private Long takenById;
    private String takenByEmail;
    private TaskStatus status;
    private Set<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskResponse fromEntity(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .categoryId(task.getCategory() != null ? task.getCategory().getId() : null)
                .categoryName(task.getCategory() != null ? task.getCategory().getName() : null)
                .rewardAmount(task.getRewardAmount())
                .currency(task.getCurrency())
                .locationText(task.getLocationText())
                .deadlineAt(task.getDeadlineAt())
                .creatorId(task.getCreator().getId())
                .creatorEmail(task.getCreator().getEmail())
                .takenById(task.getTakenBy() != null ? task.getTakenBy().getId() : null)
                .takenByEmail(task.getTakenBy() != null ? task.getTakenBy().getEmail() : null)
                .status(task.getStatus())
                .tags(task.getTags().stream().map(t -> t.getTag()).collect(Collectors.toSet()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
