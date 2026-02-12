package com.transcendence.chat.controller;

import com.transcendence.chat.dto.ConversationResponse;
import com.transcendence.chat.dto.MessageRequest;
import com.transcendence.chat.dto.MessageResponse;
import com.transcendence.chat.service.ConversationService;
import com.transcendence.chat.service.MessageService;
import com.transcendence.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getMyConversations(@AuthenticationPrincipal User user) {
        var conversations = conversationService.getUserConversations(user.getId())
                .stream()
                .map(ConversationResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationResponse> getConversation(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        if (!conversationService.isUserParticipant(id, user.getId())) {
            return ResponseEntity.notFound().build();
        }
        return conversationService.getConversationById(id)
                .map(ConversationResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<ConversationResponse> getOrCreateTaskConversation(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId) {
        var conversation = conversationService.getOrCreateTaskConversation(taskId);
        conversationService.addParticipantToConversation(conversation.getId(), user.getId());
        return ResponseEntity.ok(ConversationResponse.fromEntity(conversation));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            Pageable pageable) {
        var messages = messageService.getConversationMessages(id, user.getId(), pageable)
                .map(MessageResponse::fromEntity);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody MessageRequest request) {
        var message = messageService.sendTextMessage(id, user.getId(), request.getContent());
        return ResponseEntity.ok(MessageResponse.fromEntity(message));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markMessagesAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        messageService.markMessagesAsRead(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
