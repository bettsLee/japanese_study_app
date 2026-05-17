package com.jp5.backend.domain.quiz;

import com.jp5.backend.domain.entry.Entry;
import com.jp5.backend.domain.entry.EntryType;

public record QuizQuestionResponse(Long id, EntryType type, String content) {
    public static QuizQuestionResponse from(Entry entry) {
        return new QuizQuestionResponse(entry.getId(), entry.getType(), entry.getContent());
    }
}
