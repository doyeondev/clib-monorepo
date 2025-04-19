package com.clib.domain.clause.dto;

import com.clib.domain.clause.domain.ClibClause;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 일반 조항 DTO
 * API 응답 형식에 맞게 조항 데이터를 전달하는 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClibClauseDTO {
    private String id;
    private String clause_category;
    private String title_ko;
    private String title_en;
    private String content_ko;
    private String content_en;
    private String note;
    private String source;
    private Integer idx;
    private Boolean disabled;

    /**
     * 엔티티를 DTO로 변환하는 정적 메서드
     */
    public static ClibClauseDTO fromEntity(ClibClause clause) {
        return ClibClauseDTO.builder()
                .id(clause.getId())
                .clause_category(clause.getClauseCategory())
                .title_ko(clause.getTitleKo())
                .title_en(clause.getTitleEn())
                .content_ko(clause.getContentKo())
                .content_en(clause.getContentEn())
                .note(clause.getNote())
                .source(clause.getSource())
                .idx(clause.getIdx())
                .disabled(clause.getDisabled())
                .build();
    }

    /**
     * 엔티티 리스트를 DTO 리스트로 변환하는 정적 메서드
     */
    public static List<ClibClauseDTO> fromEntities(List<ClibClause> clauses) {
        return clauses.stream()
                .map(ClibClauseDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 