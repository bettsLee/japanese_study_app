package com.jp5.backend.domain.tag.dto;

import com.jp5.backend.domain.tag.Tag;
import java.time.LocalDateTime;

public record TagResponse(Long id, String content, LocalDateTime createdAt) {
    public static TagResponse from(Tag tag) {
        return new TagResponse(tag.getId(), tag.getContent(), tag.getCreatedAt());
    }
}
