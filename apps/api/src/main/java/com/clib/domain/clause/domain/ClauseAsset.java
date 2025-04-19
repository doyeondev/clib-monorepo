package com.clib.domain.clause.domain;

import com.clib.global.config.JsonTypes;
import com.clib.domain.contract.domain.ContractAsset;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 조항 자산 엔티티
 * clause_assets 테이블과 매핑됩니다.
 */
@Entity
@Table(name = "clause_assets")
@Getter
@Setter
@NoArgsConstructor
public class ClauseAsset {

    @Id
    @Column(name = "id")
    private String id;  // UUID 형식

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "c_idx")
    private Integer cIdx;

    @Column(name = "contract_asset")
    private String contractAsset;

    @Column(name = "clause_title")
    private String clauseTitle;

    @Column(name = "content_html", columnDefinition = "TEXT")
    private String contentHtml;

    @Convert(converter = JsonTypes.ObjectListConverter.class)
    @Column(name = "content_array", columnDefinition = "json")
    private List<Map<String, Object>> contentArray;  // array of object 형식

    @Column(name = "industry")
    private String industry;

    @Column(name = "party_a")
    private String partyA;

    @Column(name = "party_b")
    private String partyB;

    @Column(name = "creator")
    private String creator;

    @Column(name = "contract_title")
    private String contractTitle;

    @Column(name = "source")
    private String source;

    @Column(name = "url")
    private String url;

    @Column(name = "important")
    private Boolean important;

    @Convert(converter = JsonTypes.StringListConverter.class)
    @Column(name = "clib_contract", columnDefinition = "json")
    private List<String> clibContract;  // array of string 형식

    @Convert(converter = JsonTypes.StringListConverter.class)
    @Column(name = "contract_category", columnDefinition = "json")
    private List<String> contractCategory;  // array of string 형식

    // 외래키 관계 제거 - 필드만 유지
    // @ManyToOne(fetch = FetchType.LAZY, optional = true)
    // @JoinColumn(name = "contract_asset", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_clause_asset_contract_asset"))
    // private ContractAsset contract;
} 