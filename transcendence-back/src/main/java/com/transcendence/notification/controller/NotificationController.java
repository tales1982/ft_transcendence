package com.transcendence.notification.controller;

import com.transcendence.notification.dto.NotificationResponse;
import com.transcendence.notification.service.NotificationService;
import com.transcendence.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notificacoes", description = "Gerenciamento de notificacoes do usuario")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Minhas notificacoes", description = "Lista notificacoes com paginacao")
    public ResponseEntity<Page<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal User user,
            @ParameterObject Pageable pageable) {
        var notifications = notificationService.getUserNotifications(user.getId(), pageable)
                .map(NotificationResponse::fromEntity);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @Operation(summary = "Notificacoes nao lidas", description = "Lista apenas notificacoes nao lidas")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@AuthenticationPrincipal User user) {
        var notifications = notificationService.getUnreadNotifications(user.getId())
                .stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Contagem de nao lidas", description = "Retorna a quantidade de notificacoes nao lidas")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        var count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping("/{id}/read")
    @Operation(summary = "Marcar como lida", description = "Marca uma notificacao especifica como lida")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/read-all")
    @Operation(summary = "Marcar todas como lidas", description = "Marca todas as notificacoes como lidas")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.noContent().build();
    }
}
