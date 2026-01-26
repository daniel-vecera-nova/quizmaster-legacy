CREATE TABLE quiz (
    id SERIAL PRIMARY KEY,
    questions int[] NOT NULL,
    after_each boolean NOT NULL DEFAULT false
);
