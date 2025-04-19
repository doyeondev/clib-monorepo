package com.clib.domain.contract.dao;

import com.clib.domain.contract.domain.ContractAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 계약서 자산 리포지토리
 * contract_assets 테이블에 접근하는 인터페이스
 */
@Repository
public interface ContractAssetRepository extends JpaRepository<ContractAsset, String> {
    
    /**
     * 특정 산업 분야의 계약서 자산을 가져옵니다.
     */
    List<ContractAsset> findByIndustry(String industry);
    
    /**
     * 특정 출처의 계약서 자산을 가져옵니다.
     */
    List<ContractAsset> findBySource(String source);
    
    /**
     * 최신 업데이트 순으로 계약서 자산을 가져옵니다.
     */
    List<ContractAsset> findByOrderByUpdatedAtDesc();
} 