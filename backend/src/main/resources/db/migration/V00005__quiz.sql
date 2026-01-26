CREATE TABLE quiz (
    id SERIAL PRIMARY KEY,
    quiz VARCHAR NOT NULL,
    questions int[] NOT NULL
);
