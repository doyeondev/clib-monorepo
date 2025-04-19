package com.clib.domain.clause.dto;

import com.clib.domain.clause.domain.ClauseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 조항 카테고리 DTO
 * API 응답 형식에 맞게 조항 카테고리 데이터를 전달하는 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClauseCategoryDTO {
    private String id;
    private String title;
    private String title_en;
    private String color;
    private Integer idx;
    private Boolean active;

    /**
     * 엔티티를 DTO로 변환하는 정적 메서드
     */
    public static ClauseCategoryDTO fromEntity(ClauseCategory category) {
        return ClauseCategoryDTO.builder()
                .id(category.getId())
                .title(category.getTitle())
                .title_en(category.getTitleEn())
                .color(category.getColor())
                .idx(category.getIdx())
                .active(category.getActive())
                .build();
    }
} 