import os
import glob
import uuid
from database import SessionLocal
from processing import process_document_job
from models import ProcessingJob

def main():
    db = SessionLocal()
    files = glob.glob("../sample_datasets/**/*.pdf", recursive=True)
    print(f"Processing {len(files)} test datasets...")
    
    for filepath in files:
        job_id = str(uuid.uuid4())
        job = ProcessingJob(
            id=job_id,
            filename=os.path.basename(filepath),
            status="processing"
        )
        db.add(job)
        db.commit()
        print(f"Starting {filepath}...")
        try:
            process_document_job(job_id, filepath)
            print(f"Finished {filepath}")
        except Exception as e:
            print(f"Failed {filepath}: {e}")

if __name__ == "__main__":
    main()
