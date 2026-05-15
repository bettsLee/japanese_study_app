ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_entry_id_fkey;
ALTER TABLE tags ADD CONSTRAINT tags_entry_id_fkey
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE;
