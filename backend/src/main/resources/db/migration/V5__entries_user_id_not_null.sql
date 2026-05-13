-- user_id가 null인 기존 데이터 삭제 후 NOT NULL 제약 추가
DELETE FROM entries WHERE user_id IS NULL;
ALTER TABLE entries ALTER COLUMN user_id SET NOT NULL;
