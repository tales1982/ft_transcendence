package com.transcendence.task.controller;

import com.transcendence.task.dto.ReviewSubmissionRequest;
import com.transcendence.task.dto.TaskSubmissionRequest;
import com.transcendence.task.dto.TaskSubmissionResponse;
import com.transcendence.task.service.TaskSubmissionService;
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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Tag(name = "Entregas", description = "Submissao e revisao de entregas de tasks")
public class TaskSubmissionController {

    private final TaskSubmissionService submissionService;

    @GetMapping("/task/{taskId}")
    @Operation(summary = "Listar entregas de uma task", description = "Retorna todas as entregas feitas para uma task")
    public ResponseEntity<List<TaskSubmissionResponse>> getTaskSubmissions(@PathVariable Long taskId) {
        var submissions = submissionService.getSubmissionsByTask(taskId)
                .stream()
                .map(TaskSubmissionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/my")
    @Operation(summary = "Minhas entregas", description = "Retorna as entregas do usuario autenticado")
    public ResponseEntity<Page<TaskSubmissionResponse>> getMySubmissions(
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable) {
        var submissions = submissionService.getSubmissionsByUser(user.getId(), pageable)
                .map(TaskSubmissionResponse::fromEntity);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar entrega por ID")
    public ResponseEntity<TaskSubmissionResponse> getSubmission(@PathVariable Long id) {
        return submissionService.getSubmissionById(id)
                .map(TaskSubmissionResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/task/{taskId}")
    @Operation(summary = "Entregar uma task", description = "Submete a prova de conclusao de uma task")
    public ResponseEntity<TaskSubmissionResponse> submitTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskSubmissionRequest request) {
        var submission = submissionService.submitTask(taskId, user.getId(), request.getProofText());
        return ResponseEntity.ok(TaskSubmissionResponse.fromEntity(submission));
    }

    @PostMapping("/{id}/review")
    @Operation(summary = "Revisar uma entrega", description = "Aprova ou rejeita a entrega de uma task")
    public ResponseEntity<TaskSubmissionResponse> reviewSubmission(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ReviewSubmissionRequest request) {
        var submission = request.getApproved()
                ? submissionService.approveSubmission(id, user.getId(), request.getReviewNotes())
                : submissionService.rejectSubmission(id, user.getId(), request.getReviewNotes());
        return ResponseEntity.ok(TaskSubmissionResponse.fromEntity(submission));
    }
}
