package com.clib.domain.clause.dao;

import com.clib.domain.clause.domain.ClauseAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 조항 자산 리포지토리
 * clause_assets 테이블에 접근하는 인터페이스
 */
@Repository
public interface ClauseAssetRepository extends JpaRepository<ClauseAsset, String> {
    
    /**
     * 특정 계약서에 속한 조항 자산을 가져옵니다.
     */
    List<ClauseAsset> findByContractAsset(String contractAssetId);
    
    /**
     * 특정 산업 분야에 속한 조항 자산을 가져옵니다.
     */
    List<ClauseAsset> findByIndustry(String industry);
    
    /**
     * 중요 표시된 조항 자산을 가져옵니다.
     */
    List<ClauseAsset> findByImportantIsTrue();
} 