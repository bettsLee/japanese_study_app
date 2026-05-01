package com.jp5.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@Tag(name = "테스트", description = "배포 확인용 임시 API (추후 삭제 예정)")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "헬스 체크", description = "서버 상태 확인")
    public Map<String, String> health() {
        return Map.of("status", "OK");
    }

    @GetMapping("/api/ping")
    @Operation(summary = "배포 확인", description = "백엔드 배포 확인용 테스트 엔드포인트")
    public Map<String, Object> ping() {
        return Map.of(
            "message", "백엔드 배포 확인 완료 ✅",
            "timestamp", LocalDateTime.now().toString(),
            "version", "1.0.0"
        );
    }
}
