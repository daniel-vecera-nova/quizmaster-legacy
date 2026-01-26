CREATE TABLE quiz_question (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answers TEXT[] NOT NULL
);
