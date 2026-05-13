package com.jp5.backend.domain.user;

import com.jp5.backend.domain.user.dto.UserResponse;
import com.jp5.backend.domain.user.dto.UserUpsertRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "유저", description = "유저 관련 API")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/me")
    @Operation(summary = "유저 upsert", description = "로그인 후 유저 정보 저장 또는 갱신")
    public UserResponse upsertMe(@RequestBody @Valid UserUpsertRequest request, Authentication auth) {
        return userService.upsert(auth.getName(), request);
    }
}
