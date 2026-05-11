package com.jp5.backend.domain.entry;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;

class EntryTest {

    private Entry entryWith(int quizCount, int correctCount, boolean force) throws Exception {
        Entry entry = new Entry(EntryType.SENTENCE, "テスト", "user-1");
        setField(entry, "quizCount", quizCount);
        setField(entry, "correctCount", correctCount);
        setField(entry, "forceIncludeInQuiz", force);
        return entry;
    }

    private void setField(Object obj, String name, Object value) throws Exception {
        Field f = obj.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.set(obj, value);
    }

    @Test
    @DisplayName("퀴즈 노출 이력 없으면 퀴즈 대상")
    void inQuizPool_whenNoQuizHistory() throws Exception {
        Entry entry = entryWith(0, 0, false);
        assertThat(entry.isInQuizPool()).isTrue();
    }

    @Test
    @DisplayName("정답률 89% → 퀴즈 대상")
    void inQuizPool_whenAccuracyBelow90() throws Exception {
        Entry entry = entryWith(10, 8, false); // 80%
        assertThat(entry.isInQuizPool()).isTrue();
    }

    @Test
    @DisplayName("정답률 정확히 90% → 퀴즈 제외")
    void outOfQuizPool_whenAccuracyExactly90() throws Exception {
        Entry entry = entryWith(10, 9, false); // 90%
        assertThat(entry.isInQuizPool()).isFalse();
    }

    @Test
    @DisplayName("정답률 100% → 퀴즈 제외")
    void outOfQuizPool_whenPerfectAccuracy() throws Exception {
        Entry entry = entryWith(5, 5, false); // 100%
        assertThat(entry.isInQuizPool()).isFalse();
    }

    @Test
    @DisplayName("정답률 90% 이상이어도 강제 포함이면 퀴즈 대상")
    void inQuizPool_whenForced_ignoresAccuracy() throws Exception {
        Entry entry = entryWith(10, 10, true); // 100% + forced
        assertThat(entry.isInQuizPool()).isTrue();
    }

    @Test
    @DisplayName("forceAddToQuiz() 호출 후 퀴즈 대상")
    void forceAddToQuiz_setsFlag() throws Exception {
        Entry entry = entryWith(10, 9, false); // 90% → normally excluded
        entry.forceAddToQuiz();
        assertThat(entry.isInQuizPool()).isTrue();
    }
}
