package com.jp5.backend.domain.user.dto;

import com.jp5.backend.domain.user.User;

public record UserResponse(String id, String email, String name) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getName());
    }
}
