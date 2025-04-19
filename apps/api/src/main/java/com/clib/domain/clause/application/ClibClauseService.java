package com.clib.domain.clause.application;

import com.clib.domain.clause.dao.ClibClauseRepository;
import com.clib.domain.clause.domain.ClibClause;
import com.clib.domain.clause.dto.ClibClauseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 일반 조항 서비스
 * 일반 조항 관련 비즈니스 로직을 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClibClauseService {

    private final ClibClauseRepository clibClauseRepository;

    /**
     * disabled가 null 또는 false인 모든 조항을 조회합니다.
     * 일반적인 JPA 메서드 대신 Native Query 사용하여 null 값도 포함
     */
    @Transactional(readOnly = true)
    public List<ClibClauseDTO> getAllActiveClauses() {
        log.info("Native Query로 모든 활성화된 조항 조회");
        List<ClibClause> clauses = clibClauseRepository.findAllActiveOrNullDisabledClauses();
        log.debug("조회된 조항 수: {}", clauses.size());
        return ClibClauseDTO.fromEntities(clauses);
    }

    /**
     * 특정 카테고리의 disabled가 null 또는 false인 조항을 조회합니다.
     * categoryId는 외래키로 연결된 UUID 값
     */
    @Transactional(readOnly = true)
    public List<ClibClauseDTO> getActiveClausesByCategory(String categoryId) {
        log.info("Native Query로 카테고리별 활성화된 조항 조회: {}", categoryId);
        List<ClibClause> clauses = clibClauseRepository.findActiveClausesByCategory(categoryId);
        log.debug("조회된 조항 수 (카테고리 {}): {}", categoryId, clauses.size());
        return ClibClauseDTO.fromEntities(clauses);
    }

    /**
     * 조항 ID로 단일 조항을 조회합니다.
     * 해당 ID가 존재하지 않으면 null 반환
     */
    @Transactional(readOnly = true)
    public ClibClauseDTO getClauseById(String clauseId) {
        log.info("조항 조회 ID: {}", clauseId);
        return clibClauseRepository.findById(clauseId)
                .map(ClibClauseDTO::fromEntity)
                .orElseGet(() -> {
                    log.warn("ID: {}인 조항을 찾을 수 없습니다.", clauseId);
                    return null;
                });
    }
}
