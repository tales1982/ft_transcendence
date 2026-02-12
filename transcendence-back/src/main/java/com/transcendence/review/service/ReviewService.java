package com.transcendence.review.service;

import com.transcendence.review.entity.Review;
import com.transcendence.review.repository.ReviewRepository;
import com.transcendence.task.entity.Task;
import com.transcendence.task.entity.TaskStatus;
import com.transcendence.task.repository.TaskRepository;
import com.transcendence.user.entity.User;
import com.transcendence.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Review> getReviewsByTask(Long taskId) {
        return reviewRepository.findByTaskId(taskId);
    }

    public Page<Review> getReviewsForUser(Long userId, Pageable pageable) {
        return reviewRepository.findByToUserId(userId, pageable);
    }

    public Page<Review> getReviewsByUser(Long userId, Pageable pageable) {
        return reviewRepository.findByFromUserId(userId, pageable);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public Double getUserAverageRating(Long userId) {
        return reviewRepository.getAverageRatingForUser(userId);
    }

    public long getUserReviewCount(Long userId) {
        return reviewRepository.countByToUserId(userId);
    }

    @Transactional
    public Review createReview(Long taskId, Long fromUserId, Long toUserId, Short rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getStatus() != TaskStatus.APPROVED) {
            throw new RuntimeException("Can only review approved tasks");
        }

        if (reviewRepository.existsByTaskIdAndFromUserIdAndToUserId(taskId, fromUserId, toUserId)) {
            throw new RuntimeException("Review already exists");
        }

        boolean isCreator = task.getCreator().getId().equals(fromUserId);
        boolean isTaker = task.getTakenBy() != null && task.getTakenBy().getId().equals(fromUserId);

        if (!isCreator && !isTaker) {
            throw new RuntimeException("Only task participants can leave reviews");
        }

        if (isCreator && !toUserId.equals(task.getTakenBy().getId())) {
            throw new RuntimeException("Creator can only review the task taker");
        }

        if (isTaker && !toUserId.equals(task.getCreator().getId())) {
            throw new RuntimeException("Taker can only review the task creator");
        }

        User fromUser = userRepository.findById(fromUserId)
                .orElseThrow(() -> new RuntimeException("From user not found"));

        User toUser = userRepository.findById(toUserId)
                .orElseThrow(() -> new RuntimeException("To user not found"));

        Review review = Review.builder()
                .task(task)
                .fromUser(fromUser)
                .toUser(toUser)
                .rating(rating)
                .comment(comment)
                .build();

        return reviewRepository.save(review);
    }
}
