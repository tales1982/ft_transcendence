package com.transcendence.task.repository;

import com.transcendence.task.entity.TaskCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCategoryRepository extends JpaRepository<TaskCategory, Long> {

    Optional<TaskCategory> findByName(String name);

    List<TaskCategory> findByIsActiveTrue();

    boolean existsByName(String name);
}
