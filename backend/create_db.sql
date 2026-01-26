CREATE DATABASE quizmaster;

CREATE USER quizmaster WITH PASSWORD 'quizmaster';
GRANT ALL PRIVILEGES ON DATABASE quizmaster TO quizmaster;

\c quizmaster
GRANT ALL PRIVILEGES ON SCHEMA public TO quizmaster;
