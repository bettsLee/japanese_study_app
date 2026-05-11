package com.jp5.backend.domain.entry;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EntryRepository extends JpaRepository<Entry, Long> {
    List<Entry> findAllByUserIdOrderBySavedAtDesc(String userId);
    Optional<Entry> findByIdAndUserId(Long id, String userId);
}
