package com.transcendence.chat.dto;

import com.transcendence.chat.entity.Message;
import com.transcendence.chat.entity.MessageType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {

    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderEmail;
    private String content;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private MessageType type;

    public static MessageResponse fromEntity(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .senderEmail(message.getSender().getEmail())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .readAt(message.getReadAt())
                .type(message.getType())
                .build();
    }
}
