package com.jp5.backend.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserUpsertRequest(
    @NotBlank @Email String email,
    String name
) {}
