-- 계약서 자산 데이터 추가
INSERT INTO contract_assets (id, title, party_a, party_b, industry, purpose, created_at, updated_at)
VALUES ('ab13d2cc-00c9-41fe-9f24-5a592556fdd6', '샘플 계약서', '갑 당사자', '을 당사자', 'IT', '샘플 계약서 목적', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 계약서 카테고리 데이터 추가
INSERT INTO clause_categories (id, title, title_en, color, idx, created_at, updated_at)
VALUES ('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', '일반 조항', 'General', 'blue', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 이 외에도 필요한 초기 데이터를 추가할 수 있습니다 