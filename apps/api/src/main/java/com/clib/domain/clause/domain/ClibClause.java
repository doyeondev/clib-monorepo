package com.clib.domain.clause.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 조항 데이터 엔티티
 * clib_clauses 테이블과 매핑됩니다.
 */
@Entity
@Table(name = "clib_clauses")
@Getter
@Setter
@NoArgsConstructor
public class ClibClause {

    @Id
    @Column(name = "id")
    private String id;  // UUID 형식

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "clause_category")
    private String clauseCategory;  // UUID 형식 - ClauseCategory 엔티티의 id 참조

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "title_ko")
    private String titleKo;

    @Column(name = "idx")
    private Integer idx;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "content_en", columnDefinition = "TEXT")
    private String contentEn;

    @Column(name = "content_ko", columnDefinition = "TEXT")
    private String contentKo;

    @Column(name = "source")
    private String source;

    @Column(name = "disabled")
    private Boolean disabled;

    // 조항 카테고리와의 관계 설정
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "clause_category", insertable = false, updatable = false)
    // private ClauseCategory category;
} 