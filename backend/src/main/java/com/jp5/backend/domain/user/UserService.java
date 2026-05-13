package com.jp5.backend.domain.user;

import com.jp5.backend.domain.user.dto.UserResponse;
import com.jp5.backend.domain.user.dto.UserUpsertRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse upsert(String userId, UserUpsertRequest request) {
        User user = userRepository.findById(userId)
                .map(existing -> {
                    existing.update(request.email(), request.name());
                    return existing;
                })
                .orElseGet(() -> new User(userId, request.email(), request.name()));
        return UserResponse.from(userRepository.save(user));
    }
}
