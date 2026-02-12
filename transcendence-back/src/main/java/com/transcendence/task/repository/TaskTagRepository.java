package com.transcendence.task.repository;

import com.transcendence.task.entity.TaskTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskTagRepository extends JpaRepository<TaskTag, Long> {

    Optional<TaskTag> findByTag(String tag);

    boolean existsByTag(String tag);
}
