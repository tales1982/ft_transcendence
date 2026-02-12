package com.transcendence.chat.dto;

import com.transcendence.chat.entity.Conversation;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class ConversationResponse {

    private Long id;
    private Long taskId;
    private LocalDateTime createdAt;
    private List<Long> participantIds;

    public static ConversationResponse fromEntity(Conversation conversation) {
        return ConversationResponse.builder()
                .id(conversation.getId())
                .taskId(conversation.getTask() != null ? conversation.getTask().getId() : null)
                .createdAt(conversation.getCreatedAt())
                .participantIds(conversation.getParticipants().stream()
                        .map(p -> p.getUser().getId())
                        .collect(Collectors.toList()))
                .build();
    }
}
