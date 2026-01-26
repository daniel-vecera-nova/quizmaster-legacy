-- Add mode column
ALTER TABLE quiz ADD COLUMN mode VARCHAR(10);

-- Migrate data from after_each to mode
UPDATE quiz SET mode = CASE WHEN after_each THEN 'LEARN' ELSE 'EXAM' END;

-- Make mode NOT NULL with default
ALTER TABLE quiz ALTER COLUMN mode SET NOT NULL;
ALTER TABLE quiz ALTER COLUMN mode SET DEFAULT 'EXAM';

-- Add CHECK constraint to ensure only valid mode values
ALTER TABLE quiz ADD CONSTRAINT quiz_mode_check CHECK (mode IN ('LEARN', 'EXAM'));

-- Drop old after_each column
ALTER TABLE quiz DROP COLUMN after_each;
