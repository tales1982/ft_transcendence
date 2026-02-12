package com.transcendence.review.controller;

import com.transcendence.review.dto.ReviewRequest;
import com.transcendence.review.dto.ReviewResponse;
import com.transcendence.review.service.ReviewService;
import com.transcendence.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<ReviewResponse>> getTaskReviews(@PathVariable Long taskId) {
        var reviews = reviewService.getReviewsByTask(taskId)
                .stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ReviewResponse>> getUserReviews(
            @PathVariable Long userId,
            Pageable pageable) {
        var reviews = reviewService.getReviewsForUser(userId, pageable)
                .map(ReviewResponse::fromEntity);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getUserReviewStats(@PathVariable Long userId) {
        var avgRating = reviewService.getUserAverageRating(userId);
        var count = reviewService.getUserReviewCount(userId);
        return ResponseEntity.ok(Map.of(
                "averageRating", avgRating != null ? avgRating : 0,
                "totalReviews", count
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable Long id) {
        return reviewService.getReviewById(id)
                .map(ReviewResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReviewRequest request) {
        var review = reviewService.createReview(
                request.getTaskId(),
                user.getId(),
                request.getToUserId(),
                request.getRating(),
                request.getComment()
        );
        return ResponseEntity.ok(ReviewResponse.fromEntity(review));
    }
}
