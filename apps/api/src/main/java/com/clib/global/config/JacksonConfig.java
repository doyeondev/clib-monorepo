package com.clib.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * API 응답의 JSON 직렬화를 위한 Jackson 설정 클래스
 * 
 * 이 설정은 Spring MVC를 통한 REST API 응답의 JSON 직렬화 방식만 제어합니다.
 * 여기서 사용하는 ObjectMapper는 다른 영역(Redis, JPA 등)에 영향을 주지 않습니다.
 */
@Configuration
public class JacksonConfig implements WebMvcConfigurer {

    /**
     * API 응답용 ObjectMapper 생성
     * 이 매퍼는 REST API 응답 JSON 직렬화에만 사용됩니다.
     */
    @Bean("apiObjectMapper")
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        // 필요한 경우 여기에 추가 설정을 적용할 수 있습니다.
        return objectMapper;
    }
    
    /**
     * HTTP 메시지 컨버터에 apiObjectMapper를 명시적으로 설정합니다.
     * 이를 통해 API 응답 직렬화에 사용됩니다.
     */
    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter(
            ObjectMapper apiObjectMapper) {
        return new MappingJackson2HttpMessageConverter(apiObjectMapper);
    }
} 