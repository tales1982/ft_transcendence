package com.transcendence.review.repository;

import com.transcendence.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByTaskId(Long taskId);

    Page<Review> findByToUserId(Long userId, Pageable pageable);

    Page<Review> findByFromUserId(Long userId, Pageable pageable);

    Optional<Review> findByTaskIdAndFromUserIdAndToUserId(Long taskId, Long fromUserId, Long toUserId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.toUser.id = :userId")
    Double getAverageRatingForUser(@Param("userId") Long userId);

    long countByToUserId(Long userId);

    boolean existsByTaskIdAndFromUserIdAndToUserId(Long taskId, Long fromUserId, Long toUserId);
}
