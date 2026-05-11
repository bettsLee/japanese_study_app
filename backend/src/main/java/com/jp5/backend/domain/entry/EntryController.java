package com.jp5.backend.domain.entry;

import com.jp5.backend.domain.entry.dto.EntryRequest;
import com.jp5.backend.domain.entry.dto.EntryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/v1/entries")
@Tag(name = "문장/단어 저장", description = "일본어 문장·단어 저장 API")
public class EntryController {

    private final EntryService entryService;

    public EntryController(EntryService entryService) {
        this.entryService = entryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "저장", description = "문장 또는 단어를 저장하고 저장일을 자동 기록")
    public EntryResponse save(
            @RequestBody @Valid EntryRequest request,
            @RequestHeader("Authorization") String auth) {
        return entryService.save(request, extractUserId(auth));
    }

    @GetMapping
    @Operation(summary = "목록 조회", description = "로그인한 유저의 저장 목록 조회")
    public List<EntryResponse> list(@RequestHeader("Authorization") String auth) {
        return entryService.findByUser(extractUserId(auth));
    }

    @GetMapping("/{id}")
    @Operation(summary = "단건 조회", description = "저장된 항목 단건 조회")
    public EntryResponse getById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String auth) {
        return entryService.findByIdAndUser(id, extractUserId(auth));
    }

    // Supabase JWT의 sub 클레임을 userId로 추출
    private String extractUserId(String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        String[] parts = token.split("\\.");
        if (parts.length < 2) throw new IllegalArgumentException("Invalid token");
        String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
        int subIdx = payloadJson.indexOf("\"sub\":\"");
        if (subIdx == -1) throw new IllegalArgumentException("No sub in token");
        int start = subIdx + 7;
        int end = payloadJson.indexOf("\"", start);
        return payloadJson.substring(start, end);
    }
}
