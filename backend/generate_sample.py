import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def create_sample_pdf(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    
    # Page 1 - Title and Intro
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 750, "Product Specification: X200 PRESSURE SENSOR")
    c.setFont("Helvetica", 12)
    c.drawString(100, 720, "SKU: X200-24")
    c.drawString(100, 700, "Manufacturer: SensorTech Industries")
    c.drawString(100, 680, "Category: Pressure Sensor (ETIM Code: XXXX)")
    
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, 640, "Compliance & Certifications")
    c.setFont("Helvetica", 12)
    c.drawString(100, 620, "- RoHS Compliant")
    c.drawString(100, 600, "- REACH Certified")
    c.drawString(100, 580, "- UL Certification (Pending Review)")
    
    c.showPage()
    
    # Page 2 - Specifications
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, 750, "Technical Specifications")
    c.setFont("Helvetica", 12)
    c.drawString(100, 720, "IP Rating: IP65")
    c.drawString(100, 700, "Material: Stainless Steel")
    c.drawString(100, 680, "Operating Temperature: -20 to 80 °C")
    
    c.showPage()
    
    # Page 3 - Electrical & Pressure
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, 750, "Performance Parameters")
    
    c.showPage()
    
    # Page 4 - Electrical & Pressure
    c.setFont("Helvetica", 12)
    c.drawString(100, 750, "Rated Voltage: 24 V")
    
    c.showPage()
    
    # Page 5 - Pressure
    c.setFont("Helvetica", 12)
    c.drawString(100, 750, "Maximum pressure: 500 bar")
    
    c.showPage()
    
    # Page 6 - Relationships
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, 750, "Product Family & Alternatives")
    c.setFont("Helvetica", 12)
    c.drawString(100, 720, "Similar Model: X201")
    c.drawString(100, 700, "Legacy version / Potential Duplicate: X250")
    c.drawString(100, 680, "Compatible Controller: X500")
    
    c.save()
    print(f"Created {filename}")

if __name__ == "__main__":
    create_sample_pdf("X200_sensor_spec.pdf")
