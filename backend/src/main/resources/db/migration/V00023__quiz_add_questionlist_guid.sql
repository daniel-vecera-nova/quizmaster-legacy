ALTER TABLE quiz ADD COLUMN question_list varchar(36) DEFAULT NULL;
COMMENT ON COLUMN quiz.question_list IS 'Question list GUID';
ALTER TABLE quiz ADD FOREIGN KEY (question_list) REFERENCES question_list(guid) ON DELETE SET NULL;
