package com.clib.domain.clause.application;

import com.clib.domain.clause.dao.ClauseCategoryRepository;
import com.clib.domain.clause.domain.ClauseCategory;
import com.clib.domain.clause.dto.ClauseCategoryDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 조항 카테고리 서비스
 * 조항 카테고리 관련 비즈니스 로직을 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClauseCategoryService {

    private final ClauseCategoryRepository clauseCategoryRepository;

    /**
     * 모든 조항 카테고리를 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<ClauseCategoryDTO> getAllCategories() {
        log.info("조항 카테고리 전체 조회");
        List<ClauseCategory> categories = clauseCategoryRepository.findAllByOrderByIdxAsc();
        return categories.stream()
                .map(ClauseCategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 활성화된 조항 카테고리만 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<ClauseCategoryDTO> getActiveCategories() {
        log.info("활성화된 조항 카테고리 조회");
        List<ClauseCategory> categories = clauseCategoryRepository.findByActiveIsTrueOrderByIdxAsc();
        return categories.stream()
                .map(ClauseCategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * ID로 특정 조항 카테고리를 조회합니다.
     */
    @Transactional(readOnly = true)
    public ClauseCategoryDTO getCategoryById(String categoryId) {
        log.info("조항 카테고리 조회 ID: {}", categoryId);
        return clauseCategoryRepository.findById(categoryId)
                .map(ClauseCategoryDTO::fromEntity)
                .orElse(null);
    }
} 