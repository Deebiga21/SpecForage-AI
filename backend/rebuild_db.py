import os
from database import engine, Base, init_db
import models

if os.path.exists("specforage.db"):
    os.remove("specforage.db")

print("Database deleted.")
Base.metadata.create_all(bind=engine)
init_db()
print("Database recreated and seeded.")
