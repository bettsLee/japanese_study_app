package com.jp5.backend.domain.tag.dto;

import com.jp5.backend.domain.entry.EntryType;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record TagRequest(@NotNull EntryType type, List<String> tags) {}
