package com.jp5.backend.domain.tag;

import com.jp5.backend.domain.entry.Entry;
import com.jp5.backend.domain.entry.EntryRepository;
import com.jp5.backend.domain.tag.dto.TagRequest;
import com.jp5.backend.domain.tag.dto.TagResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class TagService {

    private final TagRepository tagRepository;
    private final EntryRepository entryRepository;

    public TagService(TagRepository tagRepository, EntryRepository entryRepository) {
        this.tagRepository = tagRepository;
        this.entryRepository = entryRepository;
    }

    // 기존 태그를 모두 교체 (덮어쓰기)
    public List<TagResponse> save(Long entryId, String userId, TagRequest request) {
        Entry entry = entryRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        tagRepository.deleteAllByEntryId(entryId);
        List<Tag> tags = request.tags().stream()
                .filter(t -> !t.isBlank())
                .map(t -> new Tag(entry, t.trim()))
                .toList();
        return tagRepository.saveAll(tags).stream().map(TagResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TagResponse> findByEntry(Long entryId, String userId) {
        entryRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        return tagRepository.findAllByEntryIdOrderByCreatedAtAsc(entryId)
                .stream().map(TagResponse::from).toList();
    }
}
