package com.clib.domain.clause.api;

import com.clib.domain.clause.application.ClauseCategoryService;
import com.clib.domain.clause.dto.ClauseCategoryDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 조항 카테고리 컨트롤러
 * 조항 카테고리 관련 API 엔드포인트를 제공합니다.
 */
@Slf4j
@RestController
@RequestMapping("/clause/categories")
@RequiredArgsConstructor
public class ClauseCategoryController {

    private final ClauseCategoryService clauseCategoryService;

    /**
     * 모든 조항 카테고리 조회 API
     * @return 조항 카테고리 목록
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        log.info("GET /api/clause/categories - 모든 조항 카테고리 조회 요청");
        List<ClauseCategoryDTO> categories = clauseCategoryService.getAllCategories();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", categories);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 활성화된 조항 카테고리만 조회 API
     * @return 활성화된 조항 카테고리 목록
     */
    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveCategories() {
        log.info("GET /api/clause/categories/active - 활성화된 조항 카테고리 조회 요청");
        List<ClauseCategoryDTO> categories = clauseCategoryService.getActiveCategories();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", categories);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 조항 카테고리 조회 API
     * @param categoryId 조항 카테고리 ID
     * @return 조항 카테고리 정보
     */
    @GetMapping("/{categoryId}")
    public ResponseEntity<?> getCategoryById(@PathVariable String categoryId) {
        log.info("GET /api/clause/categories/{} - 특정 조항 카테고리 조회 요청", categoryId);
        ClauseCategoryDTO category = clauseCategoryService.getCategoryById(categoryId);
        
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(category);
    }
} 