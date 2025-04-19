package com.clib.domain.clause.dao;

import com.clib.domain.clause.domain.ClauseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 조항 카테고리 리포지토리
 * clause_categories 테이블에 접근하는 인터페이스
 */
@Repository
public interface ClauseCategoryRepository extends JpaRepository<ClauseCategory, String> {
    
    /**
     * idx 기준으로 오름차순 정렬하여 모든 조항 카테고리를 가져옵니다.
     */
    List<ClauseCategory> findAllByOrderByIdxAsc();
    
    /**
     * 활성화된 조항 카테고리만 가져옵니다.
     */
    List<ClauseCategory> findByActiveIsTrueOrderByIdxAsc();
} 