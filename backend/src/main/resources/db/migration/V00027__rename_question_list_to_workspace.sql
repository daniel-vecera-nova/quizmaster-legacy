-- Rename question_list table to workspace
ALTER TABLE question_list RENAME TO workspace;

-- Rename column in quiz_question table
ALTER TABLE quiz_question RENAME COLUMN question_list_guid TO workspace_guid;

-- Rename column in quiz table
ALTER TABLE quiz RENAME COLUMN question_list TO workspace_guid;

-- Update column comment
COMMENT ON COLUMN quiz.workspace_guid IS 'Workspace GUID';
