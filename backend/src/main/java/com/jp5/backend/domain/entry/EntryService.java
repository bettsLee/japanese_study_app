package com.jp5.backend.domain.entry;

import com.jp5.backend.domain.entry.dto.EntryRequest;
import com.jp5.backend.domain.entry.dto.EntryResponse;
import com.jp5.backend.domain.tag.TagRepository;
import com.jp5.backend.domain.tag.dto.TagResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@Transactional
public class EntryService {

    private final EntryRepository entryRepository;
    private final TagRepository tagRepository;

    public EntryService(EntryRepository entryRepository, TagRepository tagRepository) {
        this.entryRepository = entryRepository;
        this.tagRepository = tagRepository;
    }

    public EntryResponse save(EntryRequest request, String userId) {
        Entry entry = new Entry(request.type(), request.content(), userId);
        return EntryResponse.from(entryRepository.save(entry));
    }

    @Transactional(readOnly = true)
    public List<EntryResponse> findByUser(String userId) {
        return entryRepository.findAllByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(e -> EntryResponse.from(e, tagRepository.findAllByEntryIdOrderByCreatedAtAsc(e.getId())
                        .stream().map(TagResponse::from).toList()))
                .toList();
    }

    @Transactional(readOnly = true)
    public EntryResponse findByIdAndUser(Long id, String userId) {
        Entry entry = entryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        List<TagResponse> tags = tagRepository.findAllByEntryIdOrderByCreatedAtAsc(id)
                .stream().map(TagResponse::from).toList();
        return EntryResponse.from(entry, tags);
    }

    public EntryResponse updateContent(Long id, String content, String userId) {
        Entry entry = entryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        entry.updateContent(content);
        return EntryResponse.from(entryRepository.save(entry));
    }

    public EntryResponse forceAddToQuiz(Long id, String userId) {
        Entry entry = entryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        entry.forceAddToQuiz();
        return EntryResponse.from(entryRepository.save(entry));
    }

    public void delete(Long id, String userId) {
        Entry entry = entryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        entryRepository.delete(entry);
    }
}
