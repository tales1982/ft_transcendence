package com.transcendence.task.service;

import com.transcendence.task.entity.TaskCategory;
import com.transcendence.task.repository.TaskCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskCategoryService {

    private final TaskCategoryRepository categoryRepository;

    public List<TaskCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<TaskCategory> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    public Optional<TaskCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<TaskCategory> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Transactional
    public TaskCategory createCategory(String name) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists");
        }

        TaskCategory category = TaskCategory.builder()
                .name(name)
                .isActive(true)
                .build();

        return categoryRepository.save(category);
    }

    @Transactional
    public TaskCategory updateCategory(Long id, String name, Boolean isActive) {
        TaskCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (name != null && !name.equals(category.getName())) {
            if (categoryRepository.existsByName(name)) {
                throw new RuntimeException("Category name already exists");
            }
            category.setName(name);
        }

        if (isActive != null) {
            category.setIsActive(isActive);
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public void deactivateCategory(Long id) {
        TaskCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setIsActive(false);
        categoryRepository.save(category);
    }
}
