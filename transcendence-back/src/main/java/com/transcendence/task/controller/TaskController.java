package com.transcendence.task.controller;

import com.transcendence.task.dto.TaskRequest;
import com.transcendence.task.dto.TaskResponse;
import com.transcendence.task.entity.TaskStatus;
import com.transcendence.task.service.TaskService;
import com.transcendence.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Gerenciamento de tasks")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Listar todas as tasks", description = "Retorna todas as tasks com paginacao")
    public ResponseEntity<Page<TaskResponse>> getAllTasks(@ParameterObject Pageable pageable) {
        var tasks = taskService.getAllTasks(pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar tasks por status", description = "Filtra tasks por status: OPEN, IN_PROGRESS, COMPLETED, CANCELLED")
    public ResponseEntity<Page<TaskResponse>> getTasksByStatus(
            @PathVariable TaskStatus status,
            @ParameterObject Pageable pageable) {
        var tasks = taskService.getTasksByStatus(status, pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/open")
    @Operation(summary = "Listar tasks abertas", description = "Retorna apenas tasks com status OPEN")
    public ResponseEntity<Page<TaskResponse>> getOpenTasks(@ParameterObject Pageable pageable) {
        var tasks = taskService.getTasksByStatus(TaskStatus.OPEN, pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-created")
    @Operation(summary = "Minhas tasks criadas", description = "Retorna tasks criadas pelo usuario autenticado")
    public ResponseEntity<Page<TaskResponse>> getMyCreatedTasks(
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable) {
        var tasks = taskService.getTasksByCreator(user.getId(), pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-taken")
    @Operation(summary = "Minhas tasks aceitas", description = "Retorna tasks que o usuario aceitou executar")
    public ResponseEntity<Page<TaskResponse>> getMyTakenTasks(
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable) {
        var tasks = taskService.getTasksTakenByUser(user.getId(), pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Listar tasks por categoria", description = "Filtra tasks por ID da categoria")
    public ResponseEntity<Page<TaskResponse>> getTasksByCategory(
            @PathVariable Long categoryId,
            @ParameterObject Pageable pageable) {
        var tasks = taskService.getTasksByCategory(categoryId, pageable)
                .map(TaskResponse::fromEntity);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar task por ID", description = "Retorna os detalhes de uma task especifica")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(TaskResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar nova task", description = "Cria uma nova task associada ao usuario autenticado")
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
    @Operation(summary = "Aceitar uma task", description = "Usuario aceita executar uma task aberta")
    public ResponseEntity<TaskResponse> takeTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        var task = taskService.takeTask(id, user.getId());
        return ResponseEntity.ok(TaskResponse.fromEntity(task));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancelar uma task", description = "Apenas o criador pode cancelar a task")
    public ResponseEntity<TaskResponse> cancelTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        var task = taskService.cancelTask(id, user.getId(), reason);
        return ResponseEntity.ok(TaskResponse.fromEntity(task));
    }
}
