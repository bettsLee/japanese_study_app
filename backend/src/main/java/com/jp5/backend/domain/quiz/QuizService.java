package com.jp5.backend.domain.quiz;

import com.jp5.backend.domain.entry.Entry;
import com.jp5.backend.domain.entry.EntryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class QuizService {

    private final EntryRepository entryRepository;

    public QuizService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    @Transactional(readOnly = true)
    public List<QuizQuestionResponse> getQuizQuestions(String userId) {
        List<Entry> eligible = new ArrayList<>(
            entryRepository.findAllByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .filter(Entry::isInQuizPool)
                .toList()
        );
        Collections.shuffle(eligible);
        return eligible.stream()
                .limit(10)
                .map(QuizQuestionResponse::from)
                .toList();
    }

    public void submitAnswer(Long entryId, boolean correct, String userId) {
        Entry entry = entryRepository.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        entry.recordAnswer(correct);
        entryRepository.save(entry);
    }
}
