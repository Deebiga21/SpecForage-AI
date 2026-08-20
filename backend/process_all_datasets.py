import os
import sys
import uuid
import time
from processing import process_document_job
from database import SessionLocal
from models import Product

def main():
    datasets_dir = "../sample_datasets"
    if not os.path.exists(datasets_dir):
        print(f"Error: {datasets_dir} does not exist.")
        return

    pdf_files = [f for f in os.listdir(datasets_dir) if f.endswith('.pdf')]
    if not pdf_files:
        print("No PDF files found in sample_datasets.")
        return

    print(f"Found {len(pdf_files)} PDF files to process.")
    
    for pdf_file in pdf_files:
        filepath = os.path.abspath(os.path.join(datasets_dir, pdf_file))
        job_id = str(uuid.uuid4())
        print(f"\n{'='*60}")
        print(f"Processing dataset: {pdf_file}")
        print(f"Job ID: {job_id}")
        print(f"{'='*60}")
        
        try:
            start_time = time.time()
            process_document_job(job_id, filepath)
            end_time = time.time()
            print(f"-> Processing finished in {end_time - start_time:.2f} seconds.")
        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")

if __name__ == "__main__":
    main()
