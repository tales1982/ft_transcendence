package com.transcendence.task.repository;

import com.transcendence.task.entity.Task;
import com.transcendence.task.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByStatus(TaskStatus status, Pageable pageable);

    Page<Task> findByCreatorId(Long creatorId, Pageable pageable);

    Page<Task> findByTakenById(Long userId, Pageable pageable);

    Page<Task> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.status = :status AND t.category.id = :categoryId")
    Page<Task> findByStatusAndCategoryId(@Param("status") TaskStatus status,
                                          @Param("categoryId") Long categoryId,
                                          Pageable pageable);

    @Query("SELECT t FROM Task t JOIN t.tags tag WHERE tag.id = :tagId")
    Page<Task> findByTagId(@Param("tagId") Long tagId, Pageable pageable);

    List<Task> findByStatusIn(List<TaskStatus> statuses);

    long countByCreatorId(Long creatorId);

    long countByTakenById(Long userId);
}
