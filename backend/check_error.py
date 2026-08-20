import sqlite3
conn = sqlite3.connect('specforage.db')
c = conn.cursor()
c.execute("SELECT id, status, error_message FROM processing_jobs")
print("Jobs:", c.fetchall())
c.execute("SELECT step_name, status, error, message FROM processing_steps")
print("Steps:", c.fetchall())
