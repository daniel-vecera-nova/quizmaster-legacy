ALTER TABLE quiz_question ADD COLUMN edit_id VARCHAR(36) DEFAULT gen_random_uuid()::VARCHAR(36);
ALTER TABLE quiz_question ALTER COLUMN edit_id SET NOT NULL;
CREATE UNIQUE INDEX idx_quiz_question_edit_id ON quiz_question(edit_id);
