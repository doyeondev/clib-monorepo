package com.clib.domain.clause.dto;

import lombok.Data;

@Data
public class ClauseItemRequest {
    private String title;
    private String contentHtml;
    private Integer index;
    private String contentArray;
} 