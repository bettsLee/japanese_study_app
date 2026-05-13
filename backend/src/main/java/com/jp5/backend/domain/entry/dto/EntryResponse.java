package com.jp5.backend.domain.entry.dto;

import com.jp5.backend.domain.entry.Entry;
import com.jp5.backend.domain.entry.EntryType;
import com.jp5.backend.domain.tag.dto.TagResponse;
import java.time.LocalDate;
import java.util.List;

public record EntryResponse(
    Long id,
    EntryType type,
    String content,
    LocalDate savedAt,
    int quizCount,
    int correctCount,
    boolean inQuizPool,
    List<TagResponse> tags
) {
    public static EntryResponse from(Entry entry) {
        return new EntryResponse(
            entry.getId(),
            entry.getType(),
            entry.getContent(),
            entry.getSavedAt(),
            entry.getQuizCount(),
            entry.getCorrectCount(),
            entry.isInQuizPool(),
            List.of()
        );
    }

    public static EntryResponse from(Entry entry, List<TagResponse> tags) {
        return new EntryResponse(
            entry.getId(),
            entry.getType(),
            entry.getContent(),
            entry.getSavedAt(),
            entry.getQuizCount(),
            entry.getCorrectCount(),
            entry.isInQuizPool(),
            tags
        );
    }
}
