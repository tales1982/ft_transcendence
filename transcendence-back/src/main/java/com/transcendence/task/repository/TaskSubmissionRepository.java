package com.transcendence.task.repository;

import com.transcendence.task.entity.SubmissionStatus;
import com.transcendence.task.entity.TaskSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {

    List<TaskSubmission> findByTaskId(Long taskId);

    Page<TaskSubmission> findBySubmittedById(Long userId, Pageable pageable);

    List<TaskSubmission> findByTaskIdAndStatus(Long taskId, SubmissionStatus status);

    Optional<TaskSubmission> findByTaskIdAndSubmittedById(Long taskId, Long userId);

    long countByTaskId(Long taskId);

    long countBySubmittedById(Long userId);
}
