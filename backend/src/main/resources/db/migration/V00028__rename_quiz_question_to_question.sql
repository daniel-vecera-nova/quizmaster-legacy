ALTER TABLE quiz_question RENAME TO question;

ALTER INDEX idx_quiz_question_edit_id RENAME TO idx_question_edit_id;
