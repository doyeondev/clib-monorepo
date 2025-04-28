// src/main/java/com/clib/global/config/JsonTypes.java

package com.clib.global.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.*;

/**
 * JSON 데이터 타입 관련 JPA 컨버터 모음
 */
@Slf4j
public class JsonTypes {

    private static final ObjectMapper objectMapper = new ObjectMapper();


    /**
     * Object 배열을 JSON으로 변환하는 컨버터
     * 예: List<Map<String, Object>> → JSON 배열
     */
    @Converter
    public static class ObjectListConverter implements AttributeConverter<List<Map<String, Object>>, String> {

        @Override
        public String convertToDatabaseColumn(List<Map<String, Object>> attribute) {
            try {
                return attribute == null ? null : objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                log.error("Object 리스트를 JSON으로 변환 중 오류 발생", e);
                return "[]";
            }
        }

        @Override
        public List<Map<String, Object>> convertToEntityAttribute(String dbData) {
            try {
                return dbData == null ? new ArrayList<>() :
                        objectMapper.readValue(dbData, new TypeReference<List<Map<String, Object>>>() {});
            } catch (IOException e) {
                log.error("JSON을 Object 리스트로 변환 중 오류 발생", e);
                return new ArrayList<>();
            }
        }
    }

    /**
     * String 배열을 JSON으로 변환하는 컨버터
     * 예: List<String> → JSON 배열
     */
    @Converter
    public static class StringListConverter implements AttributeConverter<List<String>, String> {

        @Override
        public String convertToDatabaseColumn(List<String> attribute) {
            try {
                return attribute == null ? null : objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                log.error("String 리스트를 JSON으로 변환 중 오류 발생", e);
                return "[]";
            }
        }

        @Override
        public List<String> convertToEntityAttribute(String dbData) {
            try {
                return dbData == null ? new ArrayList<>() :
                        objectMapper.readValue(dbData, new TypeReference<List<String>>() {});
            } catch (IOException e) {
                log.error("JSON을 String 리스트로 변환 중 오류 발생", e);
                return new ArrayList<>();
            }
        }
    }

    /**
     * 단일 Object(Map)를 JSON으로 변환하는 컨버터
     * 예: Map<String, Object> → JSON
     */
    @Converter
    public static class MapConverter implements AttributeConverter<Map<String, Object>, String> {

        @Override
        public String convertToDatabaseColumn(Map<String, Object> attribute) {
            try {
                return attribute == null ? null : objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                log.error("Object를 JSON으로 변환 중 오류 발생", e);
                return "{}";
            }
        }

        @Override
        public Map<String, Object> convertToEntityAttribute(String dbData) {
            try {
                return dbData == null ? new HashMap<>() :
                        objectMapper.readValue(dbData, new TypeReference<Map<String, Object>>() {});
            } catch (IOException e) {
                log.error("JSON을 Object로 변환 중 오류 발생", e);
                return new HashMap<>();
            }
        }
    }

    /**
     * 중첩 Object 배열 (이중 배열) → JSON 변환용 컨버터
     * 예: List<List<Map<String, Object>>> → JSON 배열 배열
     */
    @Converter
    public static class NestedObjectListConverter implements AttributeConverter<List<List<Map<String, Object>>>, String> {

        @Override
        public String convertToDatabaseColumn(List<List<Map<String, Object>>> attribute) {
            try {
                return attribute == null ? null : objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                log.error("이중 Object 리스트를 JSON으로 변환 중 오류 발생", e);
                return "[]";
            }
        }

        @Override
        public List<List<Map<String, Object>>> convertToEntityAttribute(String dbData) {
            try {
                return dbData == null ? new ArrayList<>() :
                        objectMapper.readValue(dbData, new TypeReference<List<List<Map<String, Object>>>>() {});
            } catch (IOException e) {
                log.error("JSON을 이중 Object 리스트로 변환 중 오류 발생", e);
                return new ArrayList<>();
            }
        }
    }
}
