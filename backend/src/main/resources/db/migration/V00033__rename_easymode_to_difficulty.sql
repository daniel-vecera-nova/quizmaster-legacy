-- Rename enum values in easy_mode column
UPDATE quiz SET easy_mode = 'KEEP_QUESTION' WHERE easy_mode = 'PERQUESTION';
UPDATE quiz SET easy_mode = 'EASY' WHERE easy_mode = 'ALWAYS';
UPDATE quiz SET easy_mode = 'HARD' WHERE easy_mode = 'NEVER';
