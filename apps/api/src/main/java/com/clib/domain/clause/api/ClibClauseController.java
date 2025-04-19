package com.clib.domain.clause.api;

import com.clib.domain.clause.application.ClibClauseService;
import com.clib.domain.clause.dto.ClibClauseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 일반 조항 컨트롤러
 * 일반 조항 관련 API 엔드포인트를 제공합니다.
 */
@Slf4j
@RestController
@RequestMapping("/clib/clauses")
@RequiredArgsConstructor
public class ClibClauseController {

    private final ClibClauseService clibClauseService;

    /**
     * 모든 활성화된 조항 조회 API
     * @return 활성화된 조항 목록
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllActiveClauses() {
        log.info("GET /api/clib/clauses - 모든 활성화된 조항 조회 요청");
        List<ClibClauseDTO> clauses = clibClauseService.getAllActiveClauses();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", clauses);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 카테고리별 활성화된 조항 조회 API
     * @param categoryId 조항 카테고리 ID
     * @return 카테고리별 활성화된 조항 목록
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getActiveClausesByCategory(@PathVariable String categoryId) {
        log.info("GET /api/clib/clauses/category/{} - 카테고리별 활성화된 조항 조회 요청", categoryId);
        List<ClibClauseDTO> clauses = clibClauseService.getActiveClausesByCategory(categoryId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", clauses);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 조항 조회 API
     * @param clauseId 조항 ID
     * @return 조항 정보
     */
    @GetMapping("/{clauseId}")
    public ResponseEntity<?> getClauseById(@PathVariable String clauseId) {
        log.info("GET /api/clib/clauses/{} - 특정 조항 조회 요청", clauseId);
        ClibClauseDTO clause = clibClauseService.getClauseById(clauseId);
        
        if (clause == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(clause);
    }
    
    /**
     * 기존 Wix API 패턴과 호환성을 위한 메서드 (/clibDataset/{query1} 형태의 API)
     * @param query1 조회 조건 (clib_clause 또는 clause_assets)
     * @return 조회 결과
     */
    @GetMapping("/dataset/{query1}")
    public ResponseEntity<Map<String, Object>> getDatasetCompatibility(@PathVariable String query1) {
        log.info("GET /api/clib/clauses/dataset/{} - 기존 호환 API 호출", query1);
        
        // 'clib_clause' 또는 'clause_assets' 쿼리인 경우 모든 활성화된 조항 반환
        if ("clib_clause".equals(query1) || "clause_assets".equals(query1)) {
            List<ClibClauseDTO> clauses = clibClauseService.getAllActiveClauses();
            
            Map<String, Object> response = new HashMap<>();
            response.put("items", clauses);
            
            return ResponseEntity.ok(response);
        }
        
        // 지원하지 않는 쿼리 파라미터인 경우
        return ResponseEntity.badRequest().build();
    }
    
    /**
     * 기존 Wix API 패턴과 호환성을 위한 메서드 (/clibDataset/{query1}/{query2} 형태의 API)
     * @param query1 조회 조건 타입
     * @param query2 조회 조건 값
     * @return 조회 결과
     */
    @GetMapping("/dataset/{query1}/{query2}")
    public ResponseEntity<Map<String, Object>> getDatasetWithParamCompatibility(
            @PathVariable String query1, @PathVariable String query2) {
        log.info("GET /api/clib/clauses/dataset/{}/{} - 기존 호환 API 호출", query1, query2);
        
        // clib_clause 또는 clause_assets 타입의 카테고리별 조회
        if (("clib_clause".equals(query1) || "clause_assets".equals(query1)) && query2 != null && !query2.isEmpty()) {
            List<ClibClauseDTO> clauses = clibClauseService.getActiveClausesByCategory(query2);
            
            Map<String, Object> response = new HashMap<>();
            response.put("items", clauses);
            
            return ResponseEntity.ok(response);
        }
        
        // 지원하지 않는 쿼리 파라미터인 경우
        return ResponseEntity.badRequest().build();
    }
} 