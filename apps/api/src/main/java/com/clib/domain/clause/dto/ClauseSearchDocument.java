package com.clib.domain.clause.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "clauses_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClauseSearchDocument {
    @Id
    private Long clauseId;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String contentHtml;
    
    @Field(type = FieldType.Long)
    private Long parentId;
} 