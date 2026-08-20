import requests
import time

url = "http://localhost:8000/api/upload"
files = {'file': open('sample_sensor_spec.txt', 'rb')}
res = requests.post(url, files=files)
data = res.json()
print("Upload response:", data)
job_id = data.get("job_id")

if job_id:
    while True:
        status_res = requests.get(f"http://localhost:8000/api/jobs/{job_id}")
        status_data = status_res.json()
        print("Status:", status_data['status'], "Progress:", status_data['progress'])
        if status_data['status'] in ['completed', 'error', 'review_required']:
            print("Final data:", status_data)
            break
        time.sleep(2)
