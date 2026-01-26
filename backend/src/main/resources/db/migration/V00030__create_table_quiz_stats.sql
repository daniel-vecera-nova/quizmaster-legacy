CREATE TABLE quiz_stats (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
    times_taken INTEGER NOT NULL DEFAULT 0,
    times_finished INTEGER NOT NULL DEFAULT 0,
    average_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    timeout_count INTEGER NOT NULL DEFAULT 0,
    failure_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
    success_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
    average_time DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX quiz_stats_quiz_id_idx ON quiz_stats(quiz_id);

INSERT INTO quiz_stats (quiz_id, times_taken, times_finished, average_score)
SELECT id, times_taken, times_finished, average_score FROM quiz;

ALTER TABLE quiz DROP COLUMN times_taken;
ALTER TABLE quiz DROP COLUMN times_finished;
ALTER TABLE quiz DROP COLUMN average_score;
