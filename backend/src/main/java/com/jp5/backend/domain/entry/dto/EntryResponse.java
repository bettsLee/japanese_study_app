package com.jp5.backend.domain.entry.dto;

import com.jp5.backend.domain.entry.Entry;
import com.jp5.backend.domain.entry.EntryType;
import java.time.LocalDate;

public record EntryResponse(
    Long id,
    EntryType type,
    String content,
    LocalDate savedAt
) {
    public static EntryResponse from(Entry entry) {
        return new EntryResponse(
            entry.getId(),
            entry.getType(),
            entry.getContent(),
            entry.getSavedAt()
        );
    }
}
