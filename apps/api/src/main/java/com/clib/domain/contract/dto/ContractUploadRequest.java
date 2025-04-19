package com.clib.domain.contract.dto;

import com.clib.domain.clause.dto.ClauseItemRequest;
import lombok.Data;

import java.util.List;

@Data
public class ContractUploadRequest {
    private String title;
    private List<ClauseItemRequest> clauses;
} 