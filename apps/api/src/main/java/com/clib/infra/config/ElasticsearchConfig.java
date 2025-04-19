package com.clib.infra.config;

/**
 * ElasticSearch 연결 관련 설정 클래스
 * 현재 ElasticSearch 서버가 실행되지 않아 연결 오류가 발생하므로 
 * 임시로 주석 처리하여 애플리케이션 실행에 지장이 없도록 함
 */
/* 
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.clib.domain.clause.dao")
public class ElasticsearchConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.builder(
                new HttpHost("localhost", 9200, "http"))
                .build();
    }

    @Bean
    public ElasticsearchTransport elasticsearchTransport() {
        return new RestClientTransport(
                restClient(),
                new JacksonJsonpMapper());
    }

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        return new ElasticsearchClient(elasticsearchTransport());
    }
}
*/ 