package com.jp5.backend.domain.tag.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record TagRequest(@NotEmpty List<String> tags) {}
