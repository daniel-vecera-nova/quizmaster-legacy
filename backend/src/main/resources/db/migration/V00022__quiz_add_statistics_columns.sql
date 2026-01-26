ALTER TABLE quiz ADD COLUMN times_taken integer DEFAULT 0;
ALTER TABLE quiz ADD COLUMN times_finished integer DEFAULT 0;
ALTER TABLE quiz ADD COLUMN average_score double precision DEFAULT 0;
