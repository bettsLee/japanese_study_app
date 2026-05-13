package com.jp5.backend.domain.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findAllByEntryIdOrderByCreatedAtAsc(Long entryId);
    void deleteAllByEntryId(Long entryId);
}
