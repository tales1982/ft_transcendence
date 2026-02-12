package com.transcendence.review.dto;

import com.transcendence.review.entity.Review;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private Long id;
    private Long taskId;
    private Long fromUserId;
    private String fromUserEmail;
    private Long toUserId;
    private String toUserEmail;
    private Short rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewResponse fromEntity(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .taskId(review.getTask().getId())
                .fromUserId(review.getFromUser().getId())
                .fromUserEmail(review.getFromUser().getEmail())
                .toUserId(review.getToUser().getId())
                .toUserEmail(review.getToUser().getEmail())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
