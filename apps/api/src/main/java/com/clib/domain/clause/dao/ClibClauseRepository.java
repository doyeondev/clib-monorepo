package com.clib.domain.clause.dao;

import com.clib.domain.clause.domain.ClibClause;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClibClauseRepository extends JpaRepository<ClibClause, String> {

    /**
     * 모든 조항 중 disabled가 null 또는 false인 항목만 조회 (Native SQL 사용)
     * JPA의 boolean 조건은 null 값을 무시하므로 명시적으로 IS NULL 조건 추가
     */
    @Query(value = """
        SELECT * FROM clib_clauses
        WHERE disabled IS NULL OR disabled = false
        ORDER BY clause_category ASC, idx ASC
    """, nativeQuery = true)
    List<ClibClause> findAllActiveOrNullDisabledClauses();

    /**
     * 특정 카테고리의 조항 중 disabled가 null 또는 false인 항목만 조회
     * 카테고리별 활성 조항을 정확하게 필터링
     */
    @Query(value = """
        SELECT * FROM clib_clauses
        WHERE clause_category = :categoryId
        AND (disabled IS NULL OR disabled = false)
        ORDER BY idx ASC
    """, nativeQuery = true)
    List<ClibClause> findActiveClausesByCategory(@Param("categoryId") String categoryId);
}
