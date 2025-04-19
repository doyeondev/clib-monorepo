package com.clib.domain.upload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DOCX 파일 처리 결과를 담는 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedDataDto {
    private String title;       // 계약서 제목
    private String partyA;      // 계약 당사자 A
    private String partyB;      // 계약 당사자 B
    private String purpose;     // 계약 목적
    private String source;      // 출처
    private String industry;    // 산업 분야
    private String language;    // 언어 (국문/영문)
    private String creator;     // 작성자

    // 컨텐츠 배열 (평면화된 배열)
    private List<Map<String, Object>> contentArray;
    
    // 그룹화된 항목 배열 (2차원 배열)
    private List<List<Map<String, Object>>> groupedArray;
    
    // h2 태그만 필터링된 항목 배열 (조항)
    private List<Map<String, Object>> clauseArray;
    
    // 첨부 파일 목록
    private List<String> appendix;
    
    // HTML 내용
    private String html;
    
    // 하이라이트된 텍스트 목록
    private List<Map<String, String>> highlightedText;
    
    // 변환 경고 메시지
    private List<String> warnings;
    
    // 메타데이터
    private Map<String, String> metaData;
} 