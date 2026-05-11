CREATE TABLE IF NOT EXISTS entries (
    id       BIGSERIAL PRIMARY KEY,
    type     VARCHAR(255) NOT NULL,
    content  TEXT         NOT NULL,
    saved_at DATE         NOT NULL
);
