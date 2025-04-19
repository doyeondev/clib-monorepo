package com.clib.domain.clause.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 조항 카테고리 엔티티
 * clause_categories 테이블과 매핑됩니다.
 */
@Entity
@Table(name = "clause_categories")
@Getter
@Setter
@NoArgsConstructor
public class ClauseCategory {

    @Id
    @Column(name = "id")
    private String id;  // UUID 형식

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "title")
    private String title;

    @Column(name = "idx")
    private Integer idx;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "color")
    private String color;
} 