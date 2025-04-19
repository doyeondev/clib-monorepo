package com.clib.domain.upload.api;

import com.clib.domain.upload.application.DocxProcessService;
import com.clib.domain.upload.dto.ProcessedDataDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 문서 업로드 및 처리를 담당하는 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final DocxProcessService docxProcessService;

    /**
     * DOCX 파일 업로드 및 처리
     * @param file DOCX 파일
     * @param source 소스 (예: "리걸인사이트")
     * @param industry 산업 분야
     * @param language 언어 (국문/영문)
     * @param creator 작성자
     * @return 처리 결과
     */
    @PostMapping(value = "/docx", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadDocx(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "source", defaultValue = "리걸인사이트") String source,
            @RequestParam(value = "industry", required = false) String industry,
            @RequestParam(value = "language", required = false, defaultValue = "국문") String language,
            @RequestParam(value = "creator", required = false) String creator) {
        
        log.info("파일 업로드 요청 - 파일명: {}, 소스: {}", file.getOriginalFilename(), source);
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "파일이 비어 있습니다."));
        }
        
        // 파일 형식 확인 (DOCX만 허용)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            return ResponseEntity.badRequest().body(Map.of("error", "DOCX 형식의 파일만 지원합니다."));
        }
        
        try {
            // DOCX 파일 처리
            Map<String, Object> result = docxProcessService.processDocxFile(file, source);
            
            // 추가 정보 삽입
            if (industry != null && !industry.isEmpty()) {
                result.put("industry", industry);
            }
            
            result.put("language", language);
            
            if (creator != null && !creator.isEmpty()) {
                result.put("creator", creator);
            }
            
            result.put("source", source);
            
            log.info("파일 처리 완료 - 파일명: {}", file.getOriginalFilename());
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            log.error("파일 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "파일 처리 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 처리된 계약서 데이터 저장
     * @param processedData 처리된 계약서 데이터
     * @return 저장 결과
     */
    @PostMapping("/save-processed")
    public ResponseEntity<Map<String, Object>> saveProcessedData(@RequestBody ProcessedDataDto processedData) {
        log.info("계약서 데이터 저장 요청 - 제목: {}", processedData.getTitle());
        
        try {
            // 계약서 데이터 검증
            if (processedData.getTitle() == null || processedData.getTitle().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "계약서 제목은 필수입니다."));
            }
            
            // TODO: 실제 DB 저장 로직 구현
            // 예: contractRepository.save(processedData);
            
            // 저장 성공 응답
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "계약서 데이터가 성공적으로 저장되었습니다.");
            response.put("data", processedData);
            
            log.info("계약서 데이터 저장 완료 - 제목: {}", processedData.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("계약서 데이터 저장 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "계약서 데이터 저장 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 계약서 데이터 삽입 (기존 프론트엔드의 insert_contractData에 대응)
     * @param requestBody 계약서 데이터 
     * @return 저장 결과
     */
    @PostMapping("/insert-contract")
    public ResponseEntity<Map<String, Object>> insertContractData(@RequestBody Map<String, Object> requestBody) {
        log.info("계약서 데이터 삽입 요청");
        
        try {
            // 요청 본문에서 data 필드 추출
            if (!requestBody.containsKey("data")) {
                return ResponseEntity.badRequest().body(Map.of("error", "요청 본문에 'data' 필드가 없습니다."));
            }
            
            Object dataObj = requestBody.get("data");
            if (!(dataObj instanceof Map)) {
                return ResponseEntity.badRequest().body(Map.of("error", "'data' 필드는 객체여야 합니다."));
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) dataObj;
            
            // 여기서만 conan.ai API 호출 (외부 API)
            try {
                // TODO: 실제 DB 저장 로직 구현 (현재는 임시 응답)
                // 예: contractRepository.saveFromMap(data);
                
                // 외부 API 호출 로깅
                log.info("외부 API(conan.ai)에 계약서 데이터 저장 요청");
                
                // 저장 성공 응답
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "계약서 데이터가 성공적으로 삽입되었습니다.");
                
                log.info("계약서 데이터 삽입 완료");
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } catch (Exception e) {
                log.error("외부 API 호출 중 오류 발생: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "외부 API 호출 중 오류가 발생했습니다: " + e.getMessage()));
            }
        } catch (Exception e) {
            log.error("계약서 데이터 삽입 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "계약서 데이터 삽입 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
} 