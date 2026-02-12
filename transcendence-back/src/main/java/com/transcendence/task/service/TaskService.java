package com.transcendence.task.service;

import com.transcendence.task.entity.*;
import com.transcendence.task.repository.*;
import com.transcendence.user.entity.User;
import com.transcendence.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskCategoryRepository categoryRepository;
    private final TaskTagRepository tagRepository;
    private final TaskStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Page<Task> getTasksByStatus(TaskStatus status, Pageable pageable) {
        return taskRepository.findByStatus(status, pageable);
    }

    public Page<Task> getTasksByCreator(Long creatorId, Pageable pageable) {
        return taskRepository.findByCreatorId(creatorId, pageable);
    }

    public Page<Task> getTasksTakenByUser(Long userId, Pageable pageable) {
        return taskRepository.findByTakenById(userId, pageable);
    }

    public Page<Task> getTasksByCategory(Long categoryId, Pageable pageable) {
        return taskRepository.findByCategoryId(categoryId, pageable);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Transactional
    public Task createTask(Long creatorId, String title, String description, Long categoryId,
                           BigDecimal rewardAmount, String locationText, LocalDateTime deadlineAt,
                           Set<String> tagNames) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TaskCategory category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Set<TaskTag> tags = new HashSet<>();
        if (tagNames != null) {
            for (String tagName : tagNames) {
                TaskTag tag = tagRepository.findByTag(tagName)
                        .orElseGet(() -> tagRepository.save(TaskTag.builder().tag(tagName).build()));
                tags.add(tag);
            }
        }

        Task task = Task.builder()
                .creator(creator)
                .title(title)
                .description(description)
                .category(category)
                .rewardAmount(rewardAmount != null ? rewardAmount : BigDecimal.ZERO)
                .locationText(locationText)
                .deadlineAt(deadlineAt)
                .tags(tags)
                .status(TaskStatus.OPEN)
                .build();

        Task savedTask = taskRepository.save(task);

        recordStatusChange(savedTask, null, TaskStatus.OPEN, creator, "Task created");

        return savedTask;
    }

    @Transactional
    public Task takeTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getStatus() != TaskStatus.OPEN) {
            throw new RuntimeException("Task is not available");
        }

        if (task.getCreator().getId().equals(userId)) {
            throw new RuntimeException("Cannot take your own task");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TaskStatus previousStatus = task.getStatus();
        task.setTakenBy(user);
        task.setStatus(TaskStatus.IN_PROGRESS);

        recordStatusChange(task, previousStatus, TaskStatus.IN_PROGRESS, user, "Task taken");

        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTaskStatus(Long taskId, TaskStatus newStatus, Long userId, String reason) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TaskStatus previousStatus = task.getStatus();
        task.setStatus(newStatus);

        recordStatusChange(task, previousStatus, newStatus, user, reason);

        return taskRepository.save(task);
    }

    @Transactional
    public Task cancelTask(Long taskId, Long userId, String reason) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getCreator().getId().equals(userId)) {
            throw new RuntimeException("Only creator can cancel the task");
        }

        if (task.getStatus() == TaskStatus.APPROVED) {
            throw new RuntimeException("Cannot cancel approved task");
        }

        return updateTaskStatus(taskId, TaskStatus.CANCELLED, userId, reason);
    }

    private void recordStatusChange(Task task, TaskStatus fromStatus, TaskStatus toStatus,
                                    User changedBy, String reason) {
        TaskStatusHistory history = TaskStatusHistory.builder()
                .task(task)
                .fromStatus(fromStatus != null ? fromStatus.name() : null)
                .toStatus(toStatus.name())
                .changedBy(changedBy)
                .reason(reason)
                .build();

        statusHistoryRepository.save(history);
    }
}
