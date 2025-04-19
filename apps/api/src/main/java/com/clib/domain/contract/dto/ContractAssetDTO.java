package com.clib.domain.contract.dto;

import com.clib.domain.contract.domain.ContractAsset;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 계약서 자산 DTO
 * API 응답 형식에 맞게 계약서 자산 데이터를 전달하는 클래스
 */
@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractAssetDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String id;
    private String title;
    private String partyA;
    private String partyB;
    private String purpose;
    private String industry;
    private String language;
    private String source;
    private String url;
    private Boolean updated;
    private JsonNode content_array;
    private JsonNode clause_array;
    private JsonNode contract_category;
    private JsonNode appendix;
    private JsonNode clib_contract;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 엔티티를 DTO로 변환하는 정적 메서드
     */
    public static ContractAssetDTO fromEntity(ContractAsset asset) {
        try {
            JsonNode contentArray = null;
            JsonNode clauseArray = null;
            JsonNode contractCategory = null;
            JsonNode appendix = null;
            JsonNode clibContract = null;

            // List<Map<String, Object>>를 JsonNode로 변환
            if (asset.getContentArray() != null && !asset.getContentArray().isEmpty()) {
                contentArray = objectMapper.valueToTree(asset.getContentArray());
            } else {
                contentArray = objectMapper.createArrayNode();
            }

            // List<Map<String, Object>>를 JsonNode로 변환
            if (asset.getClauseArray() != null && !asset.getClauseArray().isEmpty()) {
                clauseArray = objectMapper.valueToTree(asset.getClauseArray());
            } else {
                clauseArray = objectMapper.createArrayNode();
            }

            // List<String>을 JsonNode로 변환
            if (asset.getContractCategory() != null && !asset.getContractCategory().isEmpty()) {
                contractCategory = objectMapper.valueToTree(asset.getContractCategory());
            } else {
                contractCategory = objectMapper.createArrayNode();
            }

            // List<String>을 JsonNode로 변환
            if (asset.getAppendix() != null && !asset.getAppendix().isEmpty()) {
                appendix = objectMapper.valueToTree(asset.getAppendix());
            } else {
                appendix = objectMapper.createArrayNode();
            }

            // List<String>을 JsonNode로 변환
            if (asset.getClibContract() != null && !asset.getClibContract().isEmpty()) {
                clibContract = objectMapper.valueToTree(asset.getClibContract());
            } else {
                clibContract = objectMapper.createArrayNode();
            }

            return ContractAssetDTO.builder()
                    .id(asset.getId())
                    .title(asset.getTitle())
                    .partyA(asset.getPartyA())
                    .partyB(asset.getPartyB())
                    .purpose(asset.getPurpose())
                    .industry(asset.getIndustry())
                    .language(asset.getLanguage())
                    .source(asset.getSource())
                    .url(asset.getUrl())
                    .updated(asset.getUpdated())
                    .content_array(contentArray)
                    .clause_array(clauseArray)
                    .contract_category(contractCategory)
                    .appendix(appendix)
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
    public static List<ContractAssetDTO> fromEntities(List<ContractAsset> assets) {
        return assets.stream()
                .map(ContractAssetDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 