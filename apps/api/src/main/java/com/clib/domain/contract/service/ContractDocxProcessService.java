package com.clib.domain.contract.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.zwobble.mammoth.DocumentConverter;
import org.zwobble.mammoth.Result;
import org.zwobble.mammoth.internal.styles.StyleMap;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * DOCX 파일을 처리하는 서비스 (계약 도메인 전용)
 * Mammoth 라이브러리를 사용하여 DOCX를 HTML로 변환하고 필요한 정보를 추출
 */
@Service
public class ContractDocxProcessService {

    /**
     * DOCX 파일을 HTML로 변환
     * @param file DOCX 파일
     * @param source 소스 (예: "리걸인사이트")
     * @return 변환 결과와 추출된 데이터를 담은 맵
     */
    public Map<String, Object> processDocxFile(MultipartFile file, String source) throws IOException {
        Map<String, Object> result = new HashMap<>();
        
        try (InputStream inputStream = file.getInputStream()) {
            // Mammoth 설정
            DocumentConverter converter;
            if ("리걸인사이트".equals(source)) {
                // 리걸인사이트에 맞는 스타일 맵 설정
                converter = new DocumentConverter()
                    .addStyleMap("p[style-name='목적'] => span.purpose:fresh")
                    .addStyleMap("p[style-name='당사자1'] => span.party1:fresh")
                    .addStyleMap("p[style-name='당사자2'] => span.party2:fresh")
                    .addStyleMap("p[style-name='끝문장'] => span.closing:fresh")
                    .addStyleMap("p[style-name='체결일'] => span.date:fresh")
                    .addStyleMap("p[style-name='첨부1'] => span.annex1:fresh")
                    .addStyleMap("p[style-name='첨부2'] => span.annex2:fresh")
                    .addStyleMap("p[style-name='첨부3'] => span.annex3:fresh")
                    .addStyleMap("p[style-name='첨부4'] => span.annex4:fresh")
                    .addStyleMap("p[style-name='첨부5'] => span.annex5:fresh")
                    .addStyleMap("p[style-name='첨부6'] => span.annex6:fresh")
                    .addStyleMap("p[style-name='제목 2'] => h3.title:fresh")
                    .addStyleMap("p[style-name='표준'] => h4:fresh")
                    .preserveEmptyParagraphs();
            } else {
                // 기본 설정
                converter = new DocumentConverter();
            }
            
            // DOCX를 HTML로 변환
            Result<String> conversionResult = converter.convertToHtml(inputStream);
            String html = conversionResult.getValue().replace("<p></p>", "");
            
            // HTML 파싱 및 데이터 추출
            Map<String, Object> extractedData = parseHtml(html);
            
            // 결과 맵에 추가
            result.put("html", html);
            result.put("warnings", conversionResult.getWarnings());
            result.putAll(extractedData);
            
        } catch (Exception e) {
            throw new IOException("DOCX 파일 처리 중 오류 발생: " + e.getMessage(), e);
        }
        
        return result;
    }
    
    /**
     * HTML을 파싱하여 필요한 데이터를 추출
     * @param html HTML 문자열
     * @return 추출된 데이터를 담은 맵
     */
    private Map<String, Object> parseHtml(String html) {
        Map<String, Object> result = new HashMap<>();
        Map<String, String> metaData = new HashMap<>();
        List<Map<String, Object>> contentArray = new ArrayList<>();
        List<String> appendixArray = new ArrayList<>();
        
        // 정규식 패턴
        Pattern spanPattern = Pattern.compile("<span class=\"([^\"]+)\">([^<]+)</span>");
        Pattern headingPattern = Pattern.compile("<h([1-6])[^>]*>([^<]+)</h\\1>");
        Pattern annexPattern = Pattern.compile("<span class=\"annex([1-6])\">([^<]+)</span>");
        
        // span 태그에서 메타데이터 추출
        Matcher spanMatcher = spanPattern.matcher(html);
        while (spanMatcher.find()) {
            String className = spanMatcher.group(1);
            String content = spanMatcher.group(2).trim();
            
            switch (className) {
                case "party1":
                    metaData.put("partyA", content);
                    break;
                case "party2":
                    metaData.put("partyB", content);
                    break;
                case "purpose":
                    metaData.put("purpose", content);
                    break;
                case "closing":
                    metaData.put("closing", content);
                    break;
                case "date":
                    metaData.put("date", content);
                    break;
            }
        }
        
        // 첨부 파일 추출
        Matcher annexMatcher = annexPattern.matcher(html);
        while (annexMatcher.find()) {
            appendixArray.add(annexMatcher.group(2).trim());
        }
        
        // 제목과 항목 추출
        Matcher headingMatcher = headingPattern.matcher(html);
        int index = 0;
        while (headingMatcher.find()) {
            int level = Integer.parseInt(headingMatcher.group(1));
            String text = headingMatcher.group(2).trim();
            
            Map<String, Object> item = new HashMap<>();
            item.put("tag", "h" + level);
            item.put("idx", index++);
            item.put("text", text);
            
            // 항목 내용 추출 로직 (실제 구현은 더 복잡할 수 있음)
            // 여기서는 간단히 다음 제목까지의 내용을 추출하는 것으로 가정
            
            contentArray.add(item);
        }
        
        // 결과 맵에 데이터 추가
        result.put("metaData", metaData);
        result.put("contentArray", contentArray);
        result.put("appendix", appendixArray);
        
        return result;
    }
    
    /**
     * 항목과 하위 항목을 그룹화하는 메서드
     * @param contentArray 콘텐츠 배열
     * @return 그룹화된 배열
     */
    public List<List<Map<String, Object>>> groupContentItems(List<Map<String, Object>> contentArray) {
        List<List<Map<String, Object>>> groupedArray = new ArrayList<>();
        List<Map<String, Object>> currentGroup = null;
        
        for (Map<String, Object> item : contentArray) {
            String tag = (String) item.get("tag");
            
            // 새 그룹 시작 (h2 또는 h3)
            if ("h2".equals(tag) || "h3".equals(tag)) {
                if (currentGroup != null && !currentGroup.isEmpty()) {
                    groupedArray.add(new ArrayList<>(currentGroup));
                }
                currentGroup = new ArrayList<>();
                currentGroup.add(item);
            } 
            // 현재 그룹에 항목 추가
            else if (currentGroup != null) {
                currentGroup.add(item);
            }
        }
        
        // 마지막 그룹 추가
        if (currentGroup != null && !currentGroup.isEmpty()) {
            groupedArray.add(currentGroup);
        }
        
        return groupedArray;
    }
} 