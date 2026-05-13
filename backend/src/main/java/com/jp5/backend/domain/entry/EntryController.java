package com.jp5.backend.domain.entry;

import com.jp5.backend.domain.entry.dto.EntryRequest;
import com.jp5.backend.domain.entry.dto.EntryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public EntryResponse save(@RequestBody @Valid EntryRequest request, Authentication auth) {
        return entryService.save(request, auth.getName());
    }

    @GetMapping
    @Operation(summary = "목록 조회", description = "로그인한 유저의 저장 목록 조회")
    public List<EntryResponse> list(Authentication auth) {
        return entryService.findByUser(auth.getName());
    }

    @GetMapping("/{id}")
    @Operation(summary = "단건 조회", description = "저장된 항목 단건 조회")
    public EntryResponse getById(@PathVariable Long id, Authentication auth) {
        return entryService.findByIdAndUser(id, auth.getName());
    }

    @PutMapping("/{id}/quiz-add")
    @Operation(summary = "퀴즈 강제 추가", description = "정답률과 관계없이 퀴즈 대상으로 강제 추가")
    public EntryResponse forceAddToQuiz(@PathVariable Long id, Authentication auth) {
        return entryService.forceAddToQuiz(id, auth.getName());
    }
}
