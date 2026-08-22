import os
import requests
import glob
import time

def upload_files():
    base_dir = "sample_datasets"
    files = glob.glob(os.path.join(base_dir, "**/*.pdf"), recursive=True)
    
    print(f"Found {len(files)} files to process.")
    
    for filepath in files:
        print(f"Uploading {filepath}...")
        with open(filepath, "rb") as f:
            try:
                response = requests.post(
                    "http://localhost:8000/api/upload",
                    files={"file": (os.path.basename(filepath), f, "application/pdf")}
                )
                print(f"Response: {response.status_code}"); print("Sleeping 15 seconds to respect API rate limits..."); time.sleep(15)
            except Exception as e:
                print(f"Error: {e}")
                
if __name__ == "__main__":
    upload_files()
