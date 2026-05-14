package com.jp5.backend.domain.entry;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    @Column(name = "quiz_count", nullable = false)
    private int quizCount = 0;

    @Column(name = "correct_count", nullable = false)
    private int correctCount = 0;

    // true이면 정답률과 관계없이 퀴즈 대상에 강제 포함
    @Column(name = "force_include_in_quiz", nullable = false)
    private boolean forceIncludeInQuiz = false;

    @PrePersist
    protected void onCreate() {
        this.savedAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
    }

    protected Entry() {}

    public Entry(EntryType type, String content, String userId) {
        this.type = type;
        this.content = content;
        this.userId = userId;
    }

    // 정답률 90% 미만이거나 강제 포함이면 퀴즈 대상
    public boolean isInQuizPool() {
        if (forceIncludeInQuiz) return true;
        if (quizCount == 0) return true;
        return (double) correctCount / quizCount < 0.9;
    }

    public void forceAddToQuiz() {
        this.forceIncludeInQuiz = true;
    }

    public void updateType(EntryType type) {
        this.type = type;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public EntryType getType() { return type; }
    public String getContent() { return content; }
    public LocalDateTime getSavedAt() { return savedAt; }
    public int getQuizCount() { return quizCount; }
    public int getCorrectCount() { return correctCount; }
    public boolean isForceIncludeInQuiz() { return forceIncludeInQuiz; }
}
