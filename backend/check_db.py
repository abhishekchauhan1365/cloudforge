import sqlite3
try:
    conn = sqlite3.connect('cloudforge.db')
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print("Tables:", c.fetchall())
    conn.close()
except Exception as e:
    print("Error:", e)
