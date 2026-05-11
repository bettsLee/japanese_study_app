package com.jp5.backend.domain.entry;

import com.jp5.backend.domain.entry.dto.EntryRequest;
import com.jp5.backend.domain.entry.dto.EntryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@Transactional
public class EntryService {

    private final EntryRepository entryRepository;

    public EntryService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public EntryResponse save(EntryRequest request, String userId) {
        Entry entry = new Entry(request.type(), request.content(), userId);
        return EntryResponse.from(entryRepository.save(entry));
    }

    @Transactional(readOnly = true)
    public List<EntryResponse> findByUser(String userId) {
        return entryRepository.findAllByUserIdOrderBySavedAtDesc(userId)
                .stream().map(EntryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public EntryResponse findByIdAndUser(Long id, String userId) {
        return entryRepository.findByIdAndUserId(id, userId)
                .map(EntryResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
    }

    public EntryResponse forceAddToQuiz(Long id, String userId) {
        Entry entry = entryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        entry.forceAddToQuiz();
        return EntryResponse.from(entryRepository.save(entry));
    }
}
