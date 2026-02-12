package com.transcendence.task.repository;

import com.transcendence.task.entity.TaskAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long> {

    List<TaskAttachment> findByTaskId(Long taskId);

    List<TaskAttachment> findBySubmissionId(Long submissionId);

    List<TaskAttachment> findByUploadedById(Long userId);

    long countByTaskId(Long taskId);
}
