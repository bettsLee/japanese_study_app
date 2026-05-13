package com.jp5.backend.domain.tag;

import com.jp5.backend.domain.tag.dto.TagRequest;
import com.jp5.backend.domain.tag.dto.TagResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/entries/{entryId}/tags")
@Tag(name = "태그", description = "태그 저장 및 조회 API")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "태그 저장", description = "항목의 태그를 저장 (기존 태그 교체)")
    public List<TagResponse> save(
            @PathVariable Long entryId,
            @RequestBody @Valid TagRequest request,
            Authentication auth) {
        return tagService.save(entryId, auth.getName(), request);
    }

    @GetMapping
    @Operation(summary = "태그 조회", description = "항목의 태그 목록 조회")
    public List<TagResponse> list(@PathVariable Long entryId, Authentication auth) {
        return tagService.findByEntry(entryId, auth.getName());
    }
}
