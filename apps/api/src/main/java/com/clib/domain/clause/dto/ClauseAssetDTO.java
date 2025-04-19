package com.clib.domain.clause.dto;

import com.clib.domain.clause.domain.ClauseAsset;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 조항 자산 DTO
 * API 응답 형식에 맞게 조항 자산 데이터를 전달하는 클래스
 */
@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClauseAssetDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String id;
    private Integer cIdx;
    private String contract_asset;
    private String clause_title;
    private String partyA;
    private String partyB;
    private String contract_title;
    private String industry;
    private String source;
    private String url;
    private Boolean important;
    private JsonNode content_array;
    private JsonNode contract_category;
    private JsonNode clib_contract;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 엔티티를 DTO로 변환하는 정적 메서드
     */
    public static ClauseAssetDTO fromEntity(ClauseAsset asset) {
        try {
            JsonNode contentArray = null;
            JsonNode contractCategory = null;
            JsonNode clibContract = null;

            // List<Map<String, Object>>를 JsonNode로 변환
            if (asset.getContentArray() != null && !asset.getContentArray().isEmpty()) {
                contentArray = objectMapper.valueToTree(asset.getContentArray());
            } else {
                contentArray = objectMapper.createArrayNode();
            }

            // List<String>을 JsonNode로 변환
            if (asset.getContractCategory() != null && !asset.getContractCategory().isEmpty()) {
                contractCategory = objectMapper.valueToTree(asset.getContractCategory());
            } else {
                contractCategory = objectMapper.createArrayNode();
            }

            // List<String>을 JsonNode로 변환
            if (asset.getClibContract() != null && !asset.getClibContract().isEmpty()) {
                clibContract = objectMapper.valueToTree(asset.getClibContract());
            } else {
                clibContract = objectMapper.createArrayNode();
            }

            return ClauseAssetDTO.builder()
                    .id(asset.getId())
                    .cIdx(asset.getCIdx())
                    .contract_asset(asset.getContractAsset())
                    .clause_title(asset.getClauseTitle())
                    .partyA(asset.getPartyA())
                    .partyB(asset.getPartyB())
                    .contract_title(asset.getContractTitle())
                    .industry(asset.getIndustry())
                    .source(asset.getSource())
                    .url(asset.getUrl())
                    .important(asset.getImportant())
                    .content_array(contentArray)
                    .contract_category(contractCategory)
                    .clib_contract(clibContract)
                    .build();
        } catch (Exception e) {
            log.error("Error converting entity to DTO: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 엔티티 리스트를 DTO 리스트로 변환하는 정적 메서드
     */
    public static List<ClauseAssetDTO> fromEntities(List<ClauseAsset> assets) {
        return assets.stream()
                .map(ClauseAssetDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 