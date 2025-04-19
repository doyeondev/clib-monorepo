package com.clib.domain.contract.application;

import com.clib.domain.contract.dao.ContractAssetRepository;
import com.clib.domain.contract.domain.ContractAsset;
import com.clib.domain.contract.dto.ContractAssetDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 계약서 자산 서비스
 * 계약서 자산 관련 비즈니스 로직을 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ContractAssetService {

    private final ContractAssetRepository contractAssetRepository;

    /**
     * 모든 계약서 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 'all'입니다.
     */
    @Cacheable(value = "contractAssetCache", key = "'all'")
    @Transactional(readOnly = true)
    public List<ContractAssetDTO> getAllContractAssets() {
        log.info("모든 계약서 자산 조회 (캐시에 없어 DB에서 조회)");
        List<ContractAsset> assets = contractAssetRepository.findAll();
        return ContractAssetDTO.fromEntities(assets);
    }

    /**
     * 최신 업데이트 순으로 계약서 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 'latest'입니다.
     */
    @Cacheable(value = "contractAssetCache", key = "'latest'")
    @Transactional(readOnly = true)
    public List<ContractAssetDTO> getLatestContractAssets() {
        log.info("최신 업데이트 순 계약서 자산 조회 (캐시에 없어 DB에서 조회)");
        List<ContractAsset> assets = contractAssetRepository.findByOrderByUpdatedAtDesc();
        return ContractAssetDTO.fromEntities(assets);
    }

    /**
     * 특정 산업 분야의 계약서 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 산업 분야입니다.
     */
    @Cacheable(value = "contractAssetCache", key = "#industry")
    @Transactional(readOnly = true)
    public List<ContractAssetDTO> getContractAssetsByIndustry(String industry) {
        log.info("산업별 계약서 자산 조회: {} (캐시에 없어 DB에서 조회)", industry);
        List<ContractAsset> assets = contractAssetRepository.findByIndustry(industry);
        return ContractAssetDTO.fromEntities(assets);
    }

    /**
     * ID로 특정 계약서 자산을 조회합니다.
     * Redis 캐시에 저장되며, 키는 계약서 자산 ID입니다.
     */
    @Cacheable(value = "contractAssetCache", key = "#assetId")
    @Transactional(readOnly = true)
    public ContractAssetDTO getContractAssetById(String assetId) {
        log.info("계약서 자산 조회 ID: {} (캐시에 없어 DB에서 조회)", assetId);
        return contractAssetRepository.findById(assetId)
                .map(ContractAssetDTO::fromEntity)
                .orElse(null);
    }
    
    /**
     * 계약서 자산 캐시를 모두 삭제합니다.
     * 데이터 변경 시 호출하여 캐시를 갱신합니다.
     */
    @CacheEvict(value = "contractAssetCache", allEntries = true)
    public void clearCache() {
        log.info("계약서 자산 캐시 전체 삭제");
    }
} 