package com.transcendence.task.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewSubmissionRequest {

    @NotNull(message = "Approval status is required")
    private Boolean approved;

    private String reviewNotes;
}
