package com.clib.infra.redis;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Redis 캐시 설정 클래스
 * 애플리케이션의 캐시 관련 설정을 담당합니다.
 */
@Configuration
@EnableCaching
public class RedisConfig {
    
    /**
     * 캐시에 사용할 ObjectMapper 설정
     * 타입 정보를 포함하여 직렬화/역직렬화에 사용
     * 이 ObjectMapper는 Redis 캐시에만 사용되며 API 응답에는 사용되지 않음
     */
    @Bean(name = "redisObjectMapper")
    public ObjectMapper redisObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );
        return objectMapper;
    }
    
    /**
     * GenericJackson2JsonRedisSerializer 생성
     */
    @Bean
    public GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer(
            @Qualifier("redisObjectMapper") ObjectMapper redisObjectMapper) {
        return new GenericJackson2JsonRedisSerializer(redisObjectMapper);
    }

    /**
     * Redis 캐시 매니저 설정
     * 
     * @param connectionFactory Redis 연결 팩토리
     * @return Redis 캐시 매니저
     */
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory, 
                                          GenericJackson2JsonRedisSerializer jsonRedisSerializer) {
        RedisCacheConfiguration cacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1)) // 기본 TTL 1시간 설정
                .disableCachingNullValues() 
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(jsonRedisSerializer));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(cacheConfiguration)
                .withCacheConfiguration("contractAssetCache", 
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofHours(2)) // 계약서 캐시는 2시간
                                .serializeValuesWith(
                                        RedisSerializationContext.SerializationPair.fromSerializer(jsonRedisSerializer)))
                .withCacheConfiguration("clauseAssetCache", 
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofHours(2)) // 조항 캐시는 2시간
                                .serializeValuesWith(
                                        RedisSerializationContext.SerializationPair.fromSerializer(jsonRedisSerializer)))
                .build();
    }

    /**
     * Redis 템플릿 설정
     * 
     * @param connectionFactory Redis 연결 팩토리
     * @return Redis 템플릿
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory,
                                                      GenericJackson2JsonRedisSerializer jsonRedisSerializer) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(jsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
} 