package com.clib.domain.clause.api;

import com.clib.domain.clause.application.ClauseAssetService;
import com.clib.domain.clause.dto.ClauseAssetDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 조항 자산 컨트롤러
 * 조항 자산 관련 API 엔드포인트를 제공합니다.
 */
@Slf4j
@RestController
@RequestMapping("/clause/assets")
@RequiredArgsConstructor
public class ClauseAssetController {

    private final ClauseAssetService clauseAssetService;

    /**
     * 모든 조항 자산 조회 API
     * @return 조항 자산 목록
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllClauseAssets() {
        log.info("GET /api/clause/assets - 모든 조항 자산 조회 요청");
        List<ClauseAssetDTO> assets = clauseAssetService.getAllClauseAssets();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 계약서에 속한 조항 자산 조회 API
     * @param contractId 계약서 자산 ID
     * @return 계약서별 조항 자산 목록
     */
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<Map<String, Object>> getClauseAssetsByContractId(@PathVariable String contractId) {
        log.info("GET /api/clause/assets/contract/{} - 계약서별 조항 자산 조회 요청", contractId);
        List<ClauseAssetDTO> assets = clauseAssetService.getClauseAssetsByContractId(contractId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 조항 자산 조회 API
     * @param assetId 조항 자산 ID
     * @return 조항 자산 정보
     */
    @GetMapping("/{assetId}")
    public ResponseEntity<?> getClauseAssetById(@PathVariable String assetId) {
        log.info("GET /api/clause/assets/{} - 특정 조항 자산 조회 요청", assetId);
        ClauseAssetDTO asset = clauseAssetService.getClauseAssetById(assetId);
        
        if (asset == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(asset);
    }

    /**
     * 중요 표시된 조항 자산 조회 API
     * @return 중요 조항 자산 목록
     */
    @GetMapping("/important")
    public ResponseEntity<Map<String, Object>> getImportantClauseAssets() {
        log.info("GET /api/clause/assets/important - 중요 조항 자산 조회 요청");
        List<ClauseAssetDTO> assets = clauseAssetService.getImportantClauseAssets();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 기존 Wix API 패턴과 호환성을 위한 메서드 (기존의 clibClauseAsset API와 동일한 결과)
     * @return 조항 자산 목록
     */
    @GetMapping("/compatibility/clause-asset")
    public ResponseEntity<Map<String, Object>> getClauseAssetCompatibility() {
        log.info("GET /api/clause/assets/compatibility/clause-asset - 기존 호환 API 호출");
        List<ClauseAssetDTO> assets = clauseAssetService.getAllClauseAssets();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }
} 