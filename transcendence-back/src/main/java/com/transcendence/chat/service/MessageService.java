package com.transcendence.chat.service;

import com.transcendence.chat.entity.Conversation;
import com.transcendence.chat.entity.Message;
import com.transcendence.chat.entity.MessageType;
import com.transcendence.chat.repository.ConversationRepository;
import com.transcendence.chat.repository.MessageRepository;
import com.transcendence.user.entity.User;
import com.transcendence.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationService conversationService;
    private final UserRepository userRepository;

    public Page<Message> getConversationMessages(Long conversationId, Long userId, Pageable pageable) {
        if (!conversationService.isUserParticipant(conversationId, userId)) {
            throw new RuntimeException("User is not a participant");
        }
        return messageRepository.findByConversationIdOrderBySentAtDesc(conversationId, pageable);
    }

    public List<Message> getUnreadMessages(Long conversationId, Long userId) {
        return messageRepository.findUnreadMessagesForUser(conversationId, userId);
    }

    public long getUnreadCount(Long conversationId) {
        return messageRepository.countByConversationIdAndReadAtIsNull(conversationId);
    }

    @Transactional
    public Message sendMessage(Long conversationId, Long senderId, String content, MessageType type) {
        if (!conversationService.isUserParticipant(conversationId, senderId)) {
            throw new RuntimeException("User is not a participant");
        }

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .type(type != null ? type : MessageType.TEXT)
                .build();

        return messageRepository.save(message);
    }

    @Transactional
    public Message sendTextMessage(Long conversationId, Long senderId, String content) {
        return sendMessage(conversationId, senderId, content, MessageType.TEXT);
    }

    @Transactional
    public int markMessagesAsRead(Long conversationId, Long userId) {
        if (!conversationService.isUserParticipant(conversationId, userId)) {
            throw new RuntimeException("User is not a participant");
        }
        return messageRepository.markMessagesAsRead(conversationId, userId);
    }
}
