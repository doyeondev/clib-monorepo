package com.clib.domain.contract.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * 계약서 생성 및 수정 요청을 위한 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractRequestDto {

    private String title;       // 계약서 제목
    private String partyA;      // 계약 당사자 A
    private String partyB;      // 계약 당사자 B
    private String purpose;     // 계약 목적
    private String source;      // 출처
    private String industry;    // 산업 분야
    private String language;    // 언어 (국문/영문)
    private String creator;     // 작성자

    // DOCX 파일 처리 결과 데이터
    private List<Map<String, Object>> contentArray;        // 컨텐츠 배열
    private List<List<Map<String, Object>>> groupedArray;  // 그룹화된 항목 배열
    private List<String> appendix;                         // 첨부 파일 목록
    private String html;                                   // HTML 내용
} 