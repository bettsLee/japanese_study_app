package com.jp5.backend.domain.entry;

import com.jp5.backend.domain.entry.dto.EntryRequest;
import com.jp5.backend.domain.entry.dto.EntryResponse;
import com.jp5.backend.domain.tag.TagRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class EntryServiceTest {

    @Mock EntryRepository entryRepository;
    @Mock TagRepository tagRepository;
    @InjectMocks EntryService entryService;

    @Test
    @DisplayName("유저별 데이터 분리 — 본인 항목만 반환")
    void findByUser_returnsOnlyOwnEntries() {
        Entry e1 = new Entry(EntryType.SENTENCE, "おはよう", "user-1");
        Entry e2 = new Entry(EntryType.WORD, "猫", "user-1");
        given(entryRepository.findAllByUserIdOrderBySavedAtDesc("user-1"))
                .willReturn(List.of(e1, e2));
        given(tagRepository.findAllByEntryIdOrderByCreatedAtAsc(any()))
                .willReturn(List.of());

        List<EntryResponse> result = entryService.findByUser("user-1");

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("다른 유저의 항목 조회 시 404")
    void findByIdAndUser_throwsWhenWrongUser() {
        given(entryRepository.findByIdAndUserId(1L, "user-2"))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> entryService.findByIdAndUser(1L, "user-2"))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    @DisplayName("저장 시 userId 포함")
    void save_storesWithUserId() {
        EntryRequest req = new EntryRequest(EntryType.SENTENCE, "こんにちは");
        Entry saved = new Entry(EntryType.SENTENCE, "こんにちは", "user-1");
        given(entryRepository.save(any())).willReturn(saved);

        EntryResponse res = entryService.save(req, "user-1");

        assertThat(res.content()).isEqualTo("こんにちは");
    }

    @Test
    @DisplayName("forceAddToQuiz — 다른 유저 접근 시 404")
    void forceAddToQuiz_throwsWhenWrongUser() {
        given(entryRepository.findByIdAndUserId(1L, "user-2"))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> entryService.forceAddToQuiz(1L, "user-2"))
                .isInstanceOf(ResponseStatusException.class);
    }
}
