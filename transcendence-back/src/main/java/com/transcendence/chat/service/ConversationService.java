package com.transcendence.chat.service;

import com.transcendence.chat.entity.Conversation;
import com.transcendence.chat.entity.ConversationParticipant;
import com.transcendence.chat.entity.ConversationParticipantId;
import com.transcendence.chat.repository.ConversationParticipantRepository;
import com.transcendence.chat.repository.ConversationRepository;
import com.transcendence.task.entity.Task;
import com.transcendence.task.repository.TaskRepository;
import com.transcendence.user.entity.User;
import com.transcendence.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Conversation> getUserConversations(Long userId) {
        return conversationRepository.findByParticipantUserId(userId);
    }

    public Optional<Conversation> getConversationById(Long id) {
        return conversationRepository.findById(id);
    }

    public Optional<Conversation> getConversationByTaskId(Long taskId) {
        return conversationRepository.findByTaskId(taskId);
    }

    @Transactional
    public Conversation createTaskConversation(Long taskId) {
        if (conversationRepository.existsByTaskId(taskId)) {
            throw new RuntimeException("Conversation already exists for this task");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Conversation conversation = Conversation.builder()
                .task(task)
                .build();

        conversation = conversationRepository.save(conversation);

        addParticipant(conversation, task.getCreator());

        if (task.getTakenBy() != null) {
            addParticipant(conversation, task.getTakenBy());
        }

        return conversation;
    }

    @Transactional
    public Conversation getOrCreateTaskConversation(Long taskId) {
        return conversationRepository.findByTaskId(taskId)
                .orElseGet(() -> createTaskConversation(taskId));
    }

    @Transactional
    public void addParticipantToConversation(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        addParticipant(conversation, user);
    }

    private void addParticipant(Conversation conversation, User user) {
        if (participantRepository.existsByConversationIdAndUserId(conversation.getId(), user.getId())) {
            return;
        }

        ConversationParticipant participant = ConversationParticipant.builder()
                .id(new ConversationParticipantId(conversation.getId(), user.getId()))
                .conversation(conversation)
                .user(user)
                .build();

        participantRepository.save(participant);
    }

    public boolean isUserParticipant(Long conversationId, Long userId) {
        return participantRepository.existsByConversationIdAndUserId(conversationId, userId);
    }
}
