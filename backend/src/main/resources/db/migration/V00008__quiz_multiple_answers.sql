ALTER TABLE quiz_question
    ADD COLUMN correct_answers integer[];

UPDATE quiz_question
    SET correct_answers = ARRAY[correct_answer];

ALTER TABLE quiz_question
    DROP COLUMN correct_answer;
