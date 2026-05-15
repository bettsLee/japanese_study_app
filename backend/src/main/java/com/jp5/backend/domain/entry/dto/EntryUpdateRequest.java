package com.jp5.backend.domain.entry.dto;

import jakarta.validation.constraints.NotBlank;

public record EntryUpdateRequest(
    @NotBlank String content
) {}
