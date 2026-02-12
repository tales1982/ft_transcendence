package com.transcendence.task.controller;

import com.transcendence.task.dto.TaskRequest;
import com.transcendence.task.dto.TaskResponse;
import com.transcendence.task.entity.TaskStatus;
import com.transcendence.task.service.TaskService;
import com.transcendence.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAllTasks(Pageable pageable) {
        var tasks = taskService.getAllTasks(pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<TaskResponse>> getTasksByStatus(
            @PathVariable TaskStatus status,
            Pageable pageable) {
        var tasks = taskService.getTasksByStatus(status, pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/open")
    public ResponseEntity<Page<TaskResponse>> getOpenTasks(Pageable pageable) {
        var tasks = taskService.getTasksByStatus(TaskStatus.OPEN, pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-created")
    public ResponseEntity<Page<TaskResponse>> getMyCreatedTasks(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        var tasks = taskService.getTasksByCreator(user.getId(), pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-taken")
    public ResponseEntity<Page<TaskResponse>> getMyTakenTasks(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        var tasks = taskService.getTasksTakenByUser(user.getId(), pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<TaskResponse>> getTasksByCategory(
            @PathVariable Long categoryId,
            Pageable pageable) {
        var tasks = taskService.getTasksByCategory(categoryId, pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(TaskResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskRequest request) {
        var task = taskService.createTask(
                user.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getCategoryId(),
                request.getRewardAmount(),
                request.getLocationText(),
                request.getDeadlineAt(),
                request.getTags()
        );
        return ResponseEntity.ok(TaskResponse.fromEntity(task));
    }

    @PostMapping("/{id}/take")
    public ResponseEntity<TaskResponse> takeTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        var task = taskService.takeTask(id, user.getId());
        return ResponseEntity.ok(TaskResponse.fromEntity(task));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<TaskResponse> cancelTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        var task = taskService.cancelTask(id, user.getId(), reason);
        return ResponseEntity.ok(TaskResponse.fromEntity(task));
    }
}
