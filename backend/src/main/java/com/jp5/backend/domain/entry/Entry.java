package com.jp5.backend.domain.entry;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 저장 시 자동 기록
    @Column(nullable = false)
    private LocalDate savedAt;

    @PrePersist
    protected void onCreate() {
        this.savedAt = LocalDate.now();
    }

    protected Entry() {}

    public Entry(EntryType type, String content, String userId) {
        this.type = type;
        this.content = content;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public EntryType getType() { return type; }
    public String getContent() { return content; }
    public LocalDate getSavedAt() { return savedAt; }
}
