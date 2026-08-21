import os
import sys
import uuid
import time
import asyncio
from processing import process_document_job_async
import processing

# Custom hook to print real-time status to the terminal
def cli_print_job_status(job_id, status, progress, result_product_id, error_message, steps):
    # Only print meaningful updates to avoid spamming the console
    active_steps = [s['name'] for s in steps if s['status'] == 'processing']
    if active_steps:
        print(f"[Job {job_id[:8]}] Progress: {progress}% | Active: {', '.join(active_steps)}")
    elif status in ["completed", "review_required", "error"]:
        print(f"[Job {job_id[:8]}] FINISHED with status: {status}")

# Monkey-patch the processing module hook
processing.update_job_status = cli_print_job_status

async def process_with_semaphore(semaphore, job_id, filepath, pdf_file):
    async with semaphore:
        print(f"\n[{job_id[:8]}] Starting processing for {pdf_file}")
        start_time = time.time()
        try:
            await process_document_job_async(job_id, filepath)
        except Exception as e:
            print(f"[{job_id[:8]}] Error processing {pdf_file}: {e}")
        end_time = time.time()
        print(f"[{job_id[:8]}] -> Completed in {end_time - start_time:.2f} seconds.\n")

async def main_async():
    datasets_dir = "../sample_datasets"
    if not os.path.exists(datasets_dir):
        print(f"Error: {datasets_dir} does not exist.")
        return

    pdf_files = [f for f in os.listdir(datasets_dir) if f.endswith('.pdf')]
    if not pdf_files:
        print("No PDF files found in sample_datasets.")
        return

    print(f"Found {len(pdf_files)} PDF files to process.")
    
    # Limit concurrency to 4 to avoid overwhelming Gemini API and SQLite
    semaphore = asyncio.Semaphore(4)
    tasks = []
    
    for pdf_file in pdf_files:
        filepath = os.path.abspath(os.path.join(datasets_dir, pdf_file))
        job_id = str(uuid.uuid4())
        tasks.append(process_with_semaphore(semaphore, job_id, filepath, pdf_file))
        
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main_async())
