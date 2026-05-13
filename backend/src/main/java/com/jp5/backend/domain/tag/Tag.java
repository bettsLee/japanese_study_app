package com.jp5.backend.domain.tag;

import com.jp5.backend.domain.entry.Entry;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "entry_id", nullable = false)
    private Entry entry;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    protected Tag() {}

    public Tag(Entry entry, String content) {
        this.entry = entry;
        this.content = content;
    }

    public Long getId() { return id; }
    public Entry getEntry() { return entry; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
