package com.clib.domain.contract.domain;

import com.clib.domain.clause.domain.ClauseAsset;
import com.clib.global.config.JsonTypes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 계약서 자산 엔티티
 * contract_assets 테이블과 매핑됩니다.
 */
@Entity
@Table(name = "contract_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContractAsset {

    @Id
    @Column(name = "id")
    private String id;  // UUID 형식

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "title")
    private String title;

    @Column(name = "updated")
    private Boolean updated;

    @Column(name = "url")
    private String url;

    @Column(name = "purpose", columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "party_a")
    private String partyA;

    @Column(name = "party_b")
    private String partyB;

    @Column(name = "creator")
    private String creator;

    @Column(name = "industry")
    private String industry;

    @Column(name = "language")
    private String language;

    @Column(name = "source")
    private String source;

    @Convert(converter = JsonTypes.StringListConverter.class)
    @Column(name = "contract_category", columnDefinition = "json")
    private List<String> contractCategory;  // array of string 형식

    @Convert(converter = JsonTypes.StringListConverter.class)
    @Column(name = "appendix", columnDefinition = "json")
    private List<String> appendix;  // array of string 형식

    @Column(name = "content_array", columnDefinition = "json")
    @Convert(converter = JsonTypes.NestedObjectListConverter.class) // 이중 배열을 처리하는 converter
    private List<List<Map<String, Object>>> contentArray;

    @Convert(converter = JsonTypes.ObjectListConverter.class)
    @Column(name = "clause_array", columnDefinition = "json")
    private List<Map<String, Object>> clauseArray;  // array of object 형식

    @Convert(converter = JsonTypes.StringListConverter.class)
    @Column(name = "clib_contract", columnDefinition = "json")
    private List<String> clibContract;  // array of string 형식

    // 양방향 관계 제거 - ClauseAsset에서 contract 필드를 제거했으므로 이 필드도 제거해야 함
    // @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<ClauseAsset> clauses = new ArrayList<>();
} 