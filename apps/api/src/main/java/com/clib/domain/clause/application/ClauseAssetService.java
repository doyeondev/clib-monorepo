package com.clib.domain.clause.application;

import com.clib.domain.clause.dao.ClauseAssetRepository;
import com.clib.domain.clause.domain.ClauseAsset;
import com.clib.domain.clause.dto.ClauseAssetDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 조항 자산 서비스
 * 조항 자산 관련 비즈니스 로직을 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClauseAssetService {

    private final ClauseAssetRepository clauseAssetRepository;

    /**
     * 모든 조항 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 'all'입니다.
     */
    @Cacheable(value = "clauseAssetCache", key = "'all'")
    @Transactional(readOnly = true)
    public List<ClauseAssetDTO> getAllClauseAssets() {
        log.info("모든 조항 자산 조회 (캐시에 없어 DB에서 조회)");
        List<ClauseAsset> assets = clauseAssetRepository.findAll();
        return ClauseAssetDTO.fromEntities(assets);
    }

    /**
     * 특정 계약서에 속한 조항 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 계약서 ID입니다.
     */
    @Cacheable(value = "clauseAssetCache", key = "#contractId")
    @Transactional(readOnly = true)
    public List<ClauseAssetDTO> getClauseAssetsByContractId(String contractId) {
        log.info("계약서별 조항 자산 조회: {} (캐시에 없어 DB에서 조회)", contractId);
        List<ClauseAsset> assets = clauseAssetRepository.findByContractAsset(contractId);
        return ClauseAssetDTO.fromEntities(assets);
    }

    /**
     * ID로 특정 조항 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 조항 자산 ID입니다.
     */
    @Cacheable(value = "clauseAssetCache", key = "#assetId")
    @Transactional(readOnly = true)
    public ClauseAssetDTO getClauseAssetById(String assetId) {
        log.info("조항 자산 조회 ID: {} (캐시에 없어 DB에서 조회)", assetId);
        return clauseAssetRepository.findById(assetId)
                .map(ClauseAssetDTO::fromEntity)
                .orElse(null);
    }

    /**
     * 중요 표시된 조항 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 'important'입니다.
     */
    @Cacheable(value = "clauseAssetCache", key = "'important'")
    @Transactional(readOnly = true)
    public List<ClauseAssetDTO> getImportantClauseAssets() {
        log.info("중요 조항 자산 조회 (캐시에 없어 DB에서 조회)");
        List<ClauseAsset> assets = clauseAssetRepository.findByImportantIsTrue();
        return ClauseAssetDTO.fromEntities(assets);
    }
    
    /**
     * 조항 자산 캐시를 모두 삭제합니다.
     * 데이터 변경 시 호출하여 캐시를 갱신합니다.
     */
    @CacheEvict(value = "clauseAssetCache", allEntries = true)
    public void clearCache() {
        log.info("조항 자산 캐시 전체 삭제");
    }
} 