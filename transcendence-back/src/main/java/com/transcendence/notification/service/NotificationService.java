package com.transcendence.notification.service;

import com.transcendence.notification.entity.Notification;
import com.transcendence.notification.entity.NotificationType;
import com.transcendence.notification.repository.NotificationRepository;
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
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Notification createNotification(Long userId, NotificationType type, String title, String body) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .body(body)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.markAsRead(notificationId, userId);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    public void notifyNewMessage(Long userId, String senderName) {
        createNotification(userId, NotificationType.NEW_MESSAGE,
                "New Message", "You have a new message from " + senderName);
    }

    public void notifyTaskUpdate(Long userId, String taskTitle, String updateMessage) {
        createNotification(userId, NotificationType.TASK_UPDATE,
                "Task Update: " + taskTitle, updateMessage);
    }

    public void notifyPayment(Long userId, String amount, String description) {
        createNotification(userId, NotificationType.PAYMENT,
                "Payment Received", "You received " + amount + " ZION - " + description);
    }
}
