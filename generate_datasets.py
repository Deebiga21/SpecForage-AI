import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.cell(30, 10, 'Product Specification Sheet', 0, 0, 'C')
        self.ln(20)

datasets_dir = "sample_datasets"
os.makedirs(datasets_dir, exist_ok=True)

products = [
    {
        "filename": "Y300_Temperature_Sensor.pdf",
        "content": """Product Name: Y300 TEMPERATURE SENSOR
SKU: Y300-12
Category: Temperature Sensor
ETIM Code: EC002988

--- Page 2 ---
Electrical Specifications:
Rated Voltage: 12 V
Power Consumption: 0.5 W
Certifications:
RoHS Compliant
CE Certified
UL Certification: Approved

--- Page 3 ---
Physical and Operational Specifications:
Temperature Range: -40 to 125 degrees C
Accuracy: +/- 0.5 degrees C
IP Rating: IP67
Material: Aluminum
Response Time: < 2 seconds

Related Products:
Replaces older Y200 model.
"""
    },
    {
        "filename": "M50_Servo_Motor.pdf",
        "content": """Product Name: M50 INDUSTRIAL SERVO MOTOR
SKU: M50-SRV-400
Category: Servo Motor
ETIM Code: EC001851

--- Page 1 ---
Electrical Specifications:
Input Voltage: 400 V AC
Max Current: 15 A
Rated Power: 3.5 kW
Certifications:
CE Certified
REACH Compliant
Pending: CSA Certification

--- Page 2 ---
Mechanical Specifications:
Max Torque: 22 Nm
Rated Speed: 3000 RPM
IP Rating: IP65
Weight: 12 kg
Cooling: Natural Convection

Notes:
Compatible with D200 drive controllers.
"""
    },
    {
        "filename": "V10_Microcontroller.pdf",
        "content": """Product Name: V10 IoT MICROCONTROLLER BOARD
SKU: V10-IOT-WIFI
Category: Microcontroller
ETIM Code: EC001185

--- Page 1 ---
Core Specifications:
Architecture: 32-bit ARM Cortex-M4
Clock Speed: 120 MHz
Flash Memory: 1 MB
SRAM: 256 KB

--- Page 2 ---
Electrical & Connectivity:
Operating Voltage: 3.3 V
Wi-Fi: 802.11 b/g/n
Bluetooth: BLE 5.0
Certifications:
RoHS Compliant
FCC Approved
CE Certified

--- Page 3 ---
Operating conditions:
Operating Temperature: -40 to 85 degrees C
Dimensions: 45mm x 20mm
"""
    },
    {
        "filename": "P200_Hydraulic_Pump.pdf",
        "content": """Product Name: P200 HIGH PRESSURE HYDRAULIC PUMP
SKU: P200-HP-50
Category: Hydraulic Pump
ETIM Code: EC002620

--- Page 1 ---
Performance Specifications:
Max Pressure: 350 bar
Flow Rate: 50 L/min
Displacement: 25 cc/rev
Certifications:
ISO 9001
CE Certified

--- Page 2 ---
Physical Specifications:
Material: Cast Iron
Weight: 28 kg
Port Size: 3/4 inch NPT
Operating Temperature: -10 to 90 degrees C
Fluid Compatibility: Mineral Oil, Synthetic Fluids

Maintenance:
Recommended filter replacement every 1000 hours.
"""
    }
]

for prod in products:
    pdf = PDF()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)
    for line in prod["content"].split('\n'):
        pdf.cell(0, 10, line, 0, 1)
    
    filepath = os.path.join(datasets_dir, prod["filename"])
    pdf.output(filepath)
    print(f"Generated: {filepath}")

print(f"\nSuccessfully generated {len(products)} sample datasets in the '{datasets_dir}' folder!")
