package com.clib.domain.upload.application;

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
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * DOCX 파일을 처리하는 서비스
 * Mammoth 라이브러리를 사용하여 DOCX를 HTML로 변환하고 필요한 정보를 추출
 */
@Slf4j
@Service
public class DocxProcessService {

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
            
            // 소스에 따른 스타일맵 설정
            if ("엘지".equals(source)) {
                // 엘지에 맞는 스타일맵
                converter = new DocumentConverter()
                    .addStyleMap("p[style-name='TITLE'] => h1.title:fresh")
                    .addStyleMap("p[style-name='제목1'] => h11.title:fresh")
                    .addStyleMap("p[style-name='제1조'] => h2.title:fresh")
                    .addStyleMap("p[style-name='제1.1조'] => ol.level-one > li.one:fresh")
                    .addStyleMap("p[style-name='(가)'] => ol.level-one > li.two:fresh")
                    .addStyleMap("p[style-name='CONTENTS'] => p.contents:fresh")
                    .addStyleMap("p[style-name='체결일'] => span.date:fresh")
                    .addStyleMap("p[style-name='목적'] => span.purpose:fresh")
                    .addStyleMap("p[style-name='당사자1'] => span.party1:fresh")
                    .addStyleMap("p[style-name='당사자2'] => span.party2:fresh")
                    .addStyleMap("p[style-name='서문'] => p.opening:fresh")
                    .addStyleMap("p[style-name='다음'] => span.next:fresh")
                    .addStyleMap("p[style-name='끝문장'] => span.closing:fresh")
                    .addStyleMap("p[style-name='첨부1'] => span.annex1:fresh")
                    .addStyleMap("p[style-name='첨부2'] => span.annex2:fresh")
                    .addStyleMap("p[style-name='첨부3'] => span.annex3:fresh")
                    .addStyleMap("p[style-name='첨부4'] => span.annex4:fresh")
                    .addStyleMap("p[style-name='첨부5'] => span.annex5:fresh")
                    .addStyleMap("p[style-name='첨부6'] => span.annex6:fresh")
                    .addStyleMap("p[style-name='표준'] => h4.heading-side:fresh")
                    .preserveEmptyParagraphs();
            } else { // 리걸인사이트 등 기본값
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
                    .addStyleMap("p[style-name='제목1'] => h6.title:fresh")
                    .addStyleMap("p[style-name='제목 2'] => h3.title:fresh")
                    .addStyleMap("p[style-name='표준'] => h4:fresh")
                    .addStyleMap("p[style-name='list'] => ol > li > p:fresh")
                    .preserveEmptyParagraphs();
            }
            
            // DOCX를 HTML로 변환
            Result<String> conversionResult = converter.convertToHtml(inputStream);
            String html = conversionResult.getValue().replace("<p></p>", "");
            
            // HTML 파싱 및 데이터 추출
            Map<String, Object> processedData = readHtml(html, source);
            
            // 하이라이트된 텍스트 추출 및 추가
            List<Map<String, String>> highlightedText = extractHighlightedText(html);
            
            // 결과 맵 설정
            result.put("html", html);
            result.put("metaData", processedData.get("metaData"));
            result.put("contentArray", processedData.get("contentArray"));
            result.put("groupedArray", processedData.get("groupedArray"));
            result.put("appendix", processedData.get("appendix"));
            result.put("highlightedText", highlightedText);
            result.put("warnings", conversionResult.getWarnings());
            
        } catch (Exception e) {
            log.error("DOCX 파일 처리 중 오류 발생: {}", e.getMessage(), e);
            throw new IOException("DOCX 파일 처리 중 오류 발생: " + e.getMessage(), e);
        }
        
        return result;
    }
    
    /**
     * HTML 읽기 및 계약서 데이터 구조화
     * @param htmlString HTML 문자열
     * @param sourceType 문서 소스 유형
     * @return 처리된 데이터를 담은 맵
     */
    private Map<String, Object> readHtml(String htmlString, String sourceType) {
        Map<String, Object> result = new HashMap<>();
        Map<String, String> metaData = new HashMap<>();
        List<Map<String, Object>> addedItems = new ArrayList<>();
        List<String> annexArray = new ArrayList<>();
        
        // HTML 파싱
        Document htmlDoc = Jsoup.parse("<div>" + htmlString + "</div>");
        Elements allElements = htmlDoc.body().select("*");
        
        List<String> divs = new ArrayList<>();
        for (int i = 1; i < allElements.size(); i++) { // 0 인덱스는 div 래퍼
            divs.add(allElements.get(i).outerHtml());
        }
        // List 순서 뒤집기 (원본 로직 유지)
        Collections.reverse(divs);
        
        // 리스트, 테이블 처리 변수들
        List<Map<String, Object>> list = new ArrayList<>();
        List<Map<String, Object>> subList = new ArrayList<>();
        List<Map<String, Object>> table = new ArrayList<>();
        List<Map<String, Object>> row = new ArrayList<>();
        
        // 태그 무시 목록
        List<String> noTags = Arrays.asList("table", "tbody", "tr", "td", "strong");
        
        // HTML 요소 반복 처리
        for (int i = 0; i < divs.size(); i++) {
            Document doc = Jsoup.parse(divs.get(i));
            Element firstChild = doc.body().children().first();
            if (firstChild == null) continue;
            
            String text = firstChild.text();
            String tagName = firstChild.tagName();
            String className = firstChild.className();
            
            // 다음 요소 미리 확인
            Document nextDoc = null;
            String nextTagName = "";
            String nextText = "";
            if (i + 1 < divs.size()) {
                nextDoc = Jsoup.parse(divs.get(i + 1));
                Element nextFirstChild = nextDoc.body().children().first();
                if (nextFirstChild != null) {
                    nextText = nextFirstChild.text();
                    nextTagName = nextFirstChild.tagName();
                }
            }
            
            boolean hasText = text.length() > 0;
            boolean alreadyAdded = false;
            
            // 이미 추가된 항목인지 확인
            for (Map<String, Object> item : addedItems) {
                if (item.containsKey("text") && item.get("text") instanceof String && 
                    ((String)item.get("text")).trim().equals(text.trim())) {
                    alreadyAdded = true;
                    break;
                }
            }
            
            if (hasText && !alreadyAdded) {
                if (tagName.equals("li")) {
                    // 리스트 아이템 처리
                    if (className.equals("two")) {
                        Map<String, Object> subItem = new HashMap<>();
                        subItem.put("tag", tagName);
                        subItem.put("depth", className);
                        subItem.put("text", text);
                        subList.add(subItem);
                    } else if (className.equals("one")) {
                        Map<String, Object> item = new HashMap<>();
                        item.put("tag", tagName);
                        item.put("depth", className);
                        item.put("text", text);
                        
                        // 하위 리스트 복사 (원본 로직에서 역순으로 복사)
                        List<Map<String, Object>> copiedSubList = new ArrayList<>(subList);
                        Collections.reverse(copiedSubList);
                        item.put("subText", copiedSubList);
                        
                        list.add(item);
                        subList.clear();
                    }
                } else if (tagName.equals("ol")) {
                    // OL 태그 처리
                    Map<String, Object> item = new HashMap<>();
                    item.put("idx", 0);
                    item.put("tag", tagName);
                    
                    // 리스트 복사 (원본 로직에서 역순으로 복사)
                    List<Map<String, Object>> copiedList = new ArrayList<>(list);
                    Collections.reverse(copiedList);
                    item.put("text", copiedList);
                    
                    addedItems.add(item);
                    list.clear();
                } else if (tagName.equals("span")) {
                    // 메타데이터 추출
                    if (className.equals("party1")) {
                        metaData.put("partyA", text);
                    } else if (className.equals("party2")) {
                        metaData.put("partyB", text);
                    } else if (className.equals("purpose")) {
                        metaData.put("purpose", text);
                    } else if (className != null && className.contains("annex")) {
                        annexArray.add(text);
                    } else {
                        Map<String, Object> item = new HashMap<>();
                        item.put("idx", 0);
                        item.put("tag", tagName);
                        item.put("type", className);
                        item.put("text", text);
                        addedItems.add(item);
                    }
                } else if (tagName.equals("h2")) {
                    // 제목 처리
                    Map<String, Object> item = new HashMap<>();
                    item.put("idx", 0);
                    item.put("tag", tagName);
                    
                    // 리걸인사이트의 제목 처리 - 대괄호 안의 내용만 추출
                    if ("리걸인사이트".equals(sourceType) && text.contains("[") && text.contains("]")) {
                        String cleanedText = text.substring(text.indexOf('[') + 1, text.lastIndexOf(']'));
                        item.put("text", cleanedText);
                    } else {
                        item.put("text", text);
                    }
                    
                    addedItems.add(item);
                } else {
                    // 기타 태그 처리
                    if (nextTagName.equals("td")) {
                        Map<String, Object> item = new HashMap<>();
                        item.put("tag", tagName);
                        item.put("text", text);
                        row.add(item);
                    } else if (nextTagName.equals("tr")) {
                        // 행 복사 후 추가 (원본 로직에서 역순으로 복사)
                        List<Map<String, Object>> copiedRow = new ArrayList<>(row);
                        Collections.reverse(copiedRow);
                        // table 리스트에 copiedRow의 각 맵을 개별적으로 추가
                        table.addAll(copiedRow);
                        row.clear();
                    } else if (tagName.equals("table")) {
                        table.clear();
                    } else if (!noTags.contains(tagName)) {
                        Map<String, Object> item = new HashMap<>();
                        item.put("idx", 0);
                        item.put("tag", tagName);
                        item.put("text", text);
                        addedItems.add(item);
                        
                        // 리걸인사이트 opening 클래스 다음에 br 태그 추가
                        if ("리걸인사이트".equals(sourceType) && className.equals("opening")) {
                            Map<String, Object> brItem = new HashMap<>();
                            brItem.put("idx", 0);
                            brItem.put("tag", "br");
                            brItem.put("id", String.valueOf((long)(Math.floor(Math.random() * 10000000000L))));
                            brItem.put("html", "<br/>");
                            brItem.put("text", "");
                            addedItems.add(brItem);
                        }
                    }
                }
            } else {
                // 빈 요소 처리
                if (tagName.equals("br") && !tagName.equals(nextTagName)) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("idx", 0);
                    item.put("tag", tagName);
                    item.put("text", "");
                    addedItems.add(item);
                }
            }
        }
        
        // 전처리한 항목들을 역순으로 변경 (원본 로직 유지)
        Collections.reverse(addedItems);
        
        // 계약서 데이터 구조화
        int idx = 0;
        for (Map<String, Object> item : addedItems) {
            // 고유 ID 생성
            item.put("id", String.valueOf((long)(Math.floor(Math.random() * 10000000000L))));
            
            // h2 태그마다 idx 증가
            if ("h2".equals(item.get("tag"))) {
                idx++;
            }
            item.put("idx", idx);
        }
        
        // HTML 생성
        generateHtml(addedItems);
        
        // 항목 그룹화
        List<List<Map<String, Object>>> groupedArray = groupContentItems(addedItems);
        
        // 메타데이터 제목 설정
        if (addedItems.size() > 0) {
            for (Map<String, Object> item : addedItems) {
                if ("h1".equals(item.get("tag")) && item.containsKey("text")) {
                    metaData.put("title", item.get("text").toString());
                    break;
                }
            }
        }
        
        // 결과 맵 설정
        result.put("metaData", metaData);
        result.put("contentArray", addedItems);
        result.put("groupedArray", groupedArray);
        result.put("appendix", annexArray);
        result.put("highlightedText", extractHighlightedText(htmlString));
        
        return result;
    }
    
    /**
     * HTML 생성
     * @param clauseArray 조항 배열
     */
    private void generateHtml(List<Map<String, Object>> clauseArray) {
        for (Map<String, Object> item : clauseArray) {
            String tag = (String) item.get("tag");
            
            // HTML 생성 로직
            if ("br".equals(tag)) {
                // 연속된 br 태그 처리
                if (clauseArray.indexOf(item) + 1 < clauseArray.size()) {
                    Map<String, Object> nextItem = clauseArray.get(clauseArray.indexOf(item) + 1);
                    if (!"br".equals(nextItem.get("tag"))) {
                        item.put("html", "<br/>");
                    } else {
                        item.put("html", "");
                    }
                } else {
                    item.put("html", "<br/>");
                }
            } else if (("ol".equals(tag) || "ul".equals(tag)) && item.containsKey("text")) {
                Object textObj = item.get("text");
                if (textObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> textArray = (List<Map<String, Object>>) textObj;
                    
                    StringBuilder listHtml = new StringBuilder();
                    
                    for (Map<String, Object> listItem : textArray) {
                        if (listItem.containsKey("tag")) {
                            String itemTag = (String) listItem.get("tag");
                            StringBuilder sublistHtml = new StringBuilder();
                            
                            // 서브리스트 처리
                            if (listItem.containsKey("subText")) {
                                @SuppressWarnings("unchecked")
                                List<Map<String, Object>> subTextArray = (List<Map<String, Object>>) listItem.get("subText");
                                
                                for (Map<String, Object> subItem : subTextArray) {
                                    if (subItem.containsKey("tag")) {
                                        String subItemTag = (String) subItem.get("tag");
                                        String subItemText = subItem.containsKey("text") ? subItem.get("text").toString() : "";
                                        String subItemId = String.valueOf((long)(Math.floor(Math.random() * 10000000000L)));
                                        
                                        sublistHtml.append(String.format("<%s name='level-two-item' class='level-two-item' id=%s>%s</%s>",
                                                subItemTag, subItemId, subItemText, subItemTag));
                                    }
                                }
                                
                                if (sublistHtml.length() > 0) {
                                    sublistHtml = new StringBuilder("<ol name='level-two-list' class='level-two-list list-[upper-roman]'>")
                                            .append(sublistHtml).append("</ol>");
                                }
                            }
                            
                            String itemText = listItem.containsKey("text") ? listItem.get("text").toString() : "";
                            String itemId = String.valueOf((long)(Math.floor(Math.random() * 10000000000L)));
                            
                            listHtml.append(String.format("<%s name='level-one-item' class='level-one-item' id=%s>%s%s</%s>",
                                    itemTag, itemId, itemText, sublistHtml.toString(), itemTag));
                        }
                    }
                    
                    String listId = item.containsKey("id") ? item.get("id").toString() 
                            : String.valueOf((long)(Math.floor(Math.random() * 10000000000L)));
                    
                    item.put("html", String.format("<%s name='level-one-list' class='level-one-list' id=%s>%s</%s>",
                            tag, listId, listHtml.toString(), tag));
                }
            } else {
                // 일반 요소 HTML 생성
                String text = item.containsKey("text") ? item.get("text").toString() : "";
                item.put("html", String.format("<%s>%s</%s>", tag, text, tag));
            }
        }
    }
    
    /**
     * 항목을 idx 값으로 그룹화하는 메서드
     * @param contentArray 컨텐츠 배열
     * @return 그룹화된 배열
     */
    private List<List<Map<String, Object>>> groupContentItems(List<Map<String, Object>> contentArray) {
        List<List<Map<String, Object>>> groupedArray = new ArrayList<>();
        Map<Integer, List<Map<String, Object>>> groupMap = new HashMap<>();
        
        // idx 값으로 항목 그룹화
        for (Map<String, Object> item : contentArray) {
            Integer idx = (Integer) item.get("idx");
            if (!groupMap.containsKey(idx)) {
                groupMap.put(idx, new ArrayList<>());
            }
            groupMap.get(idx).add(item);
        }
        
        // idx 값 정렬 후 그룹화된 항목 추가
        List<Integer> sortedKeys = new ArrayList<>(groupMap.keySet());
        Collections.sort(sortedKeys);
        
        for (Integer key : sortedKeys) {
            groupedArray.add(groupMap.get(key));
        }
        
        return groupedArray;
    }
    
    /**
     * 하이라이트된 텍스트 추출 메서드
     * @param html HTML 문자열
     * @return 하이라이트된 텍스트 목록
     */
    private List<Map<String, String>> extractHighlightedText(String html) {
        List<Map<String, String>> highlightedTexts = new ArrayList<>();
        Document doc = Jsoup.parse(html);
        
        // 색상이 지정된 span 요소 추출
        Elements colorSpans = doc.select("span[style*=color]");
        for (Element span : colorSpans) {
            String style = span.attr("style");
            String text = span.text();
            String color = "";
            
            if (style.contains("#0070c0") || style.contains("blue")) {
                color = "blue";
            } else if (style.contains("#ff0000") || style.contains("red")) {
                color = "red";
            } else if (style.contains("#7030a0") || style.contains("purple")) {
                color = "purple";
            }
            
            if (!color.isEmpty()) {
                Map<String, String> highlightItem = new HashMap<>();
                highlightItem.put("text", text);
                highlightItem.put("color", color);
                highlightedTexts.add(highlightItem);
            }
        }
        
        // 색상이 지정된 li 요소 추출
        Elements colorLists = doc.select("li[style*=color]");
        for (Element li : colorLists) {
            String style = li.attr("style");
            String text = li.text();
            String color = "";
            
            if (style.contains("#0070c0") || style.contains("blue")) {
                color = "blue";
            } else if (style.contains("#ff0000") || style.contains("red")) {
                color = "red";
            } else if (style.contains("#7030a0") || style.contains("purple")) {
                color = "purple";
            }
            
            if (!color.isEmpty()) {
                Map<String, String> highlightItem = new HashMap<>();
                highlightItem.put("text", text);
                highlightItem.put("color", color);
                highlightedTexts.add(highlightItem);
            }
        }
        
        return highlightedTexts;
    }
} 