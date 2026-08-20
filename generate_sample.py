from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.cell(30, 10, 'Product Specification Sheet', 0, 0, 'C')
        self.ln(20)

pdf = PDF()
pdf.add_page()
pdf.set_font('Arial', '', 12)

content = """
Product Name: X200 PRESSURE SENSOR
SKU: X200-24
Category: Pressure Sensor
ETIM Code: XXXX

--- Page 4 ---
Electrical Specifications:
Rated Voltage: 24 V
Certifications:
RoHS Compliant
REACH Compliant
UL Certification: Pending Review

--- Page 5 ---
Physical and Operational Specifications:
Maximum pressure: 500 bar
IP Rating: IP65
Material: Stainless Steel
Operating Temperature: -20 to 80 degrees C

Related Products:
Similar to X201. 
Potential replacement for X250.
Compatible with X500 system.
"""

for line in content.split('\n'):
    pdf.cell(0, 10, line, 0, 1)

pdf.output("sample_sensor_spec.pdf")
print("PDF generated successfully at sample_sensor_spec.pdf")
