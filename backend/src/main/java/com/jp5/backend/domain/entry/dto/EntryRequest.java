package com.jp5.backend.domain.entry.dto;

import com.jp5.backend.domain.entry.EntryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EntryRequest(
    @NotNull EntryType type,
    @NotBlank String content
) {}
