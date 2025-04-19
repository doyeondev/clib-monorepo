package com.clib.domain.contract.api;

import com.clib.domain.contract.application.ContractAssetService;
import com.clib.domain.contract.dto.ContractAssetDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 계약서 자산 컨트롤러
 * 계약서 자산 관련 API 엔드포인트를 제공합니다.
 */
@Slf4j
@RestController
@RequestMapping("/contract/assets")
@RequiredArgsConstructor
public class ContractAssetController {

    private final ContractAssetService contractAssetService;

    /**
     * 모든 계약서 자산 조회 API
     * @return 계약서 자산 목록
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllContractAssets() {
        log.info("GET /api/contract/assets - 모든 계약서 자산 조회 요청");
        List<ContractAssetDTO> assets = contractAssetService.getAllContractAssets();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 최신 업데이트 순 계약서 자산 조회 API
     * @return 최신 업데이트 순 계약서 자산 목록
     */
    @GetMapping("/latest")
    public ResponseEntity<Map<String, Object>> getLatestContractAssets() {
        log.info("GET /api/contract/assets/latest - 최신 업데이트 순 계약서 자산 조회 요청");
        List<ContractAssetDTO> assets = contractAssetService.getLatestContractAssets();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 산업별 계약서 자산 조회 API
     * @param industry 산업 분야
     * @return 산업별 계약서 자산 목록
     */
    @GetMapping("/industry/{industry}")
    public ResponseEntity<Map<String, Object>> getContractAssetsByIndustry(@PathVariable String industry) {
        log.info("GET /api/contract/assets/industry/{} - 산업별 계약서 자산 조회 요청", industry);
        List<ContractAssetDTO> assets = contractAssetService.getContractAssetsByIndustry(industry);
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 계약서 자산 조회 API
     * @param assetId 계약서 자산 ID
     * @return 계약서 자산 정보
     */
    @GetMapping("/{assetId}")
    public ResponseEntity<?> getContractAssetById(@PathVariable String assetId) {
        log.info("GET /api/contract/assets/{} - 특정 계약서 자산 조회 요청", assetId);
        ContractAssetDTO asset = contractAssetService.getContractAssetById(assetId);
        
        if (asset == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(asset);
    }
    
    /**
     * 기존 Wix API 패턴과 호환성을 위한 메서드 (기존의 clibContractList API와 동일한 결과)
     * @return 계약서 자산 목록
     */
    @GetMapping("/compatibility/contract-list")
    public ResponseEntity<Map<String, Object>> getContractListCompatibility() {
        log.info("GET /api/contract/assets/compatibility/contract-list - 기존 호환 API 호출");
        List<ContractAssetDTO> assets = contractAssetService.getAllContractAssets();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", assets);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 기존 Wix API 패턴과 호환성을 위한 메서드 (기존의 clibContractItem API와 동일한 결과)
     * @param assetId 계약서 자산 ID
     * @return 계약서 자산 정보
     */
    @GetMapping("/compatibility/contract-item/{assetId}")
    public ResponseEntity<Map<String, Object>> getContractItemCompatibility(@PathVariable String assetId) {
        log.info("GET /api/contract/assets/compatibility/contract-item/{} - 기존 호환 API 호출", assetId);
        ContractAssetDTO asset = contractAssetService.getContractAssetById(assetId);
        
        if (asset == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", List.of(asset));
        
        return ResponseEntity.ok(response);
    }
} 