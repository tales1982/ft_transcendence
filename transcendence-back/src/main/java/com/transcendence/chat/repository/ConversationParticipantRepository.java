package com.transcendence.chat.repository;

import com.transcendence.chat.entity.ConversationParticipant;
import com.transcendence.chat.entity.ConversationParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, ConversationParticipantId> {

    List<ConversationParticipant> findByConversationId(Long conversationId);

    List<ConversationParticipant> findByUserId(Long userId);

    boolean existsByConversationIdAndUserId(Long conversationId, Long userId);
}
