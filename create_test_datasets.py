import os
from fpdf import FPDF
import json

class TestPDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'INDUSTRIAL DATASHEET', 0, 1, 'C')
        self.ln(5)

def create_dataset(filepath, content_pages):
    pdf = TestPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    for page_num, text in enumerate(content_pages, start=1):
        pdf.add_page()
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 10, f'--- Page {page_num} ---', 0, 1, 'R')
        pdf.set_font('Arial', '', 11)
        for line in text.split('\n'):
            pdf.multi_cell(0, 7, line)
    pdf.output(filepath)
    print(f"Generated: {filepath}")

def main():
    base_dir = "sample_datasets"
    folders = ["electrical", "mechanical", "sensors"]
    for folder in folders:
        os.makedirs(os.path.join(base_dir, folder), exist_ok=True)
    
    datasets = [
        # Dataset 1: Complete
        {
            "path": "electrical/circuit_breaker_01.pdf",
            "pages": [
                "Product: CB400 Molded Case Circuit Breaker\nManufacturer: ABC Electrical\nSKU: CB400-3P-250A\nCategory: Circuit Breaker",
                "Technical Specifications:\nRated Voltage: 500 V\nCurrent Rating: 250 A\nPoles: 3\nMaterial: Thermoplastic",
                "Dimensions:\nLength: 150mm\nWidth: 100mm\nWeight: 2.5 kg",
                "Operating Environment:\nOperating Temperature: -20 to 60 C\nIP Rating: IP54",
                "Compliance & Certifications:\nRoHS Compliant\nREACH Compliant (Evident by standard EN 60947-2)\nCE Marked"
            ]
        },
        # Dataset 2: Missing Specs
        {
            "path": "electrical/circuit_breaker_02.pdf",
            "pages": [
                "Product: CB-Lite Circuit Breaker\nManufacturer: ABC Electrical\nSKU: CBL-3P-100A",
                "Technical Specifications:\nRated Voltage: 400 V\nCurrent Rating: 100 A\nPoles: 3",
                "Note: The Operating Temperature, Breaking Capacity, and Weight specifications are currently pending final engineering review and are omitted from this revision.",
                "Compliance:\nCE Marked\nRoHS Compliant"
            ]
        },
        # Dataset 3: Duplicate
        {
            "path": "mechanical/pump_01.pdf",
            "pages": [
                "Product: Centrifugal Pump X1\nManufacturer: HydroDynamics\nSKU: CP-X1-500",
                "Technical Specifications:\nMax Pressure: 150 bar\nFlow Rate: 120 L/min\nMaterial: Stainless Steel 316",
                "Similar to our CP-X1-500-B model with identical internals and performance curves."
            ]
        },
        {
            "path": "mechanical/pump_01_duplicate.pdf",
            "pages": [
                "Product: Centrifugal Pump X1-B\nManufacturer: HydroDynamics\nSKU: CP-X1-500-B",
                "Technical Specifications:\nMax Pressure: 150 bar\nFlow Rate: 120 L/min\nMaterial: Stainless Steel 316",
                "A re-badged version of the standard X1 for the European market."
            ]
        },
        # Dataset 4: Conflicting
        {
            "path": "mechanical/industrial_motor_01.pdf",
            "pages": [
                "Product: Heavy Duty AC Motor\nManufacturer: MotorWorks Inc\nSKU: AC-HD-45KW",
                "Technical Specifications:\nPower: 45 kW\nVoltage (Rated): 400V AC\nSpeed: 1450 RPM",
                "Installation Guide:\nEnsure base is secure.",
                "Electrical Connections:\nWARNING: Connect only to a 480V AC supply as per the terminal rating.",
                "Compliance:\nCE, RoHS"
            ]
        },
        # Dataset 5: Missing Compliance
        {
            "path": "mechanical/bearing_01.pdf",
            "pages": [
                "Product: Roller Bearing 6205\nManufacturer: SpinTech\nSKU: BRG-6205-ZZ",
                "Technical Specifications:\nInner Diameter: 25 mm\nOuter Diameter: 52 mm\nWidth: 15 mm\nMaterial: Chrome Steel",
                "Note: This product is designed for high-speed applications.",
                "Compliance Information:\nPending environmental review. REACH compliance is currently not certified for this batch."
            ]
        },
        # Dataset 6: Ambiguous Taxonomy
        {
            "path": "sensors/temperature_sensor_01.pdf",
            "pages": [
                "Product: Smart Thermo-Switch\nManufacturer: SenseCorp\nSKU: TS-SW-100",
                "Overview:\nThis device acts as both a continuous temperature transmitter and a discrete limit switch.",
                "Specifications:\nRange: -50 to 150 C\nOutput 1: 4-20mA continuous\nOutput 2: 24V DC Relay (Switch)",
                "Is it a sensor? Is it a switch? It functions as both in automated control systems."
            ]
        },
        # Dataset 7: Low Confidence
        {
            "path": "sensors/pressure_sensor_01.pdf",
            "pages": [
                "Pr0duct: P-Sensre 2000\nManu: PrssCorp\nSKU: PS-2K-1",
                "Sp3cs:\nPr3ssure: 0-10b@r\n0utput: 0-10V",
                "D1m3ns10ns: ~50mm x 20mm\n1P Rating: lP6?",
                "(Scanned from a poor quality fax copy)"
            ]
        }
    ]

    for ds in datasets:
        create_dataset(os.path.join(base_dir, ds["path"]), ds["pages"])

    # Create README.md
    readme_content = """# SpecForage AI Sample Test Datasets

This directory contains synthetic datasheets specifically designed to test the insight generation capabilities of SPECForge AI.

## Datasets

1. **Dataset 1: Complete** (`electrical/circuit_breaker_01.pdf`)
   - Fully populated datasheet with all expected fields, compliance, and taxonomy. Tests baseline processing.
2. **Dataset 2: Missing Specs** (`electrical/circuit_breaker_02.pdf`)
   - Intentionally missing Temperature, Breaking Capacity, and Weight. Tests Data Gap Insight generation.
3. **Dataset 3: Duplicate** (`mechanical/pump_01.pdf` & `pump_01_duplicate.pdf`)
   - Two products with different SKUs but identical specifications. Tests Duplicate Detection Insight.
4. **Dataset 4: Conflicting Specs** (`mechanical/industrial_motor_01.pdf`)
   - Voltage listed as 400V on page 2, but 480V on page 4. Tests Risk/Conflict Insight.
5. **Dataset 5: Missing Compliance** (`mechanical/bearing_01.pdf`)
   - Explicitly lacks REACH compliance evidence. Tests Compliance Gap Insight.
6. **Dataset 6: Ambiguous Taxonomy** (`sensors/temperature_sensor_01.pdf`)
   - Describes a product that is both a sensor and a switch. Tests Taxonomy Confidence Insight.
7. **Dataset 7: Low Confidence** (`sensors/pressure_sensor_01.pdf`)
   - Contains OCR errors, typos, and garbled text. Tests Low Confidence / Catalog Quality Insight.
"""
    with open(os.path.join(base_dir, "README.md"), "w") as f:
        f.write(readme_content)

if __name__ == "__main__":
    main()
