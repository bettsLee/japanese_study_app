package com.jp5.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@Tag(name = "시스템", description = "서버 상태 확인 API")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "헬스 체크", description = "서버 정상 동작 여부 확인")
    public Map<String, String> health() {
        return Map.of("status", "OK");
    }

    @GetMapping("/api/v1/check")
    @Operation(summary = "배포 확인", description = "백엔드 배포 상태 및 서버 정보 반환")
    public Map<String, String> check() {
        return Map.of(
            "status", "OK",
            "server", "Render",
            "checkedAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
    }
}
