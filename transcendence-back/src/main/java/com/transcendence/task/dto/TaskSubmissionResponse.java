package com.transcendence.task.dto;

import com.transcendence.task.entity.SubmissionStatus;
import com.transcendence.task.entity.TaskSubmission;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TaskSubmissionResponse {

    private Long id;
    private Long taskId;
    private Long submittedById;
    private String submittedByEmail;
    private String proofText;
    private SubmissionStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private Long reviewedById;
    private String reviewNotes;

    public static TaskSubmissionResponse fromEntity(TaskSubmission submission) {
        return TaskSubmissionResponse.builder()
                .id(submission.getId())
                .taskId(submission.getTask().getId())
                .submittedById(submission.getSubmittedBy().getId())
                .submittedByEmail(submission.getSubmittedBy().getEmail())
                .proofText(submission.getProofText())
                .status(submission.getStatus())
                .submittedAt(submission.getSubmittedAt())
                .reviewedAt(submission.getReviewedAt())
                .reviewedById(submission.getReviewedBy() != null ? submission.getReviewedBy().getId() : null)
                .reviewNotes(submission.getReviewNotes())
                .build();
    }
}
