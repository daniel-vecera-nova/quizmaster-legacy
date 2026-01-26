CREATE TABLE quiz_answer (
    id SERIAL PRIMARY KEY,
    quiz_run_id int NOT NULL,
    question_id int NOT NULL,
    answers TEXT[] NOT NULL
);
