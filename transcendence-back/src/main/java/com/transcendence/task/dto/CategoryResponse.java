package com.transcendence.task.dto;

import com.transcendence.task.entity.TaskCategory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private Boolean isActive;

    public static CategoryResponse fromEntity(TaskCategory category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .isActive(category.getIsActive())
                .build();
    }
}
