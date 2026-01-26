CREATE TABLE quiz_run (
    id SERIAL PRIMARY KEY,
    quiz_id int NOT NULL,
    question_id int NOT NULL,
    answers TEXT[] NOT NULL
);
