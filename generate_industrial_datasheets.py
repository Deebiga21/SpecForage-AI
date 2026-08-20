"""
Generate realistic 20-30 page industrial PDF datasheets.
Each PDF contains extensive sections like real manufacturer datasheets:
Product overview, detailed specs, wiring, installation, ordering,
troubleshooting, maintenance, safety, accessories, environmental testing, etc.
"""

from fpdf import FPDF
import os
import random

OUTPUT_DIR = "sample_datasets"
os.makedirs(OUTPUT_DIR, exist_ok=True)


class DatasheetPDF(FPDF):
    def __init__(self, product_name, manufacturer, sku, doc_number):
        super().__init__()
        self.product_name = product_name
        self.manufacturer = manufacturer
        self.sku = sku
        self.doc_number = doc_number
        self.set_auto_page_break(auto=True, margin=20)

    def header(self):
        self.set_font("Arial", "B", 9)
        self.cell(0, 5, self.manufacturer, 0, 0, "L")
        self.cell(0, 5, f"Doc: {self.doc_number} | Rev B", 0, 1, "R")
        self.set_draw_color(0, 80, 160)
        self.set_line_width(0.6)
        self.line(10, 13, 200, 13)
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 7)
        self.cell(0, 10, f"{self.manufacturer} | {self.sku} | Confidential | Page {self.page_no()}/{{nb}}", 0, 0, "C")

    def section_title(self, title, number=""):
        self.set_font("Arial", "B", 13)
        self.set_fill_color(0, 70, 140)
        self.set_text_color(255, 255, 255)
        label = f"  {number}  {title}" if number else f"  {title}"
        self.cell(0, 9, label, 0, 1, "L", fill=True)
        self.set_text_color(0, 0, 0)
        self.ln(3)

    def sub_section(self, title):
        self.set_font("Arial", "B", 11)
        self.set_fill_color(220, 230, 245)
        self.cell(0, 7, f"  {title}", 0, 1, "L", fill=True)
        self.ln(2)

    def add_spec_row(self, label, value, unit=""):
        self.set_font("Arial", "B", 9)
        self.cell(65, 6, label, 0, 0)
        self.set_font("Arial", "", 9)
        if unit:
            self.cell(80, 6, value, 0, 0)
            self.set_font("Arial", "I", 8)
            self.cell(0, 6, unit, 0, 1)
        else:
            self.cell(0, 6, value, 0, 1)

    def add_paragraph(self, text):
        self.set_font("Arial", "", 9)
        self.multi_cell(0, 5, text)
        self.ln(2)

    def add_table(self, headers, rows, col_widths=None):
        if col_widths is None:
            col_w = 190 / len(headers)
            col_widths = [col_w] * len(headers)
        self.set_font("Arial", "B", 8)
        self.set_fill_color(0, 70, 140)
        self.set_text_color(255, 255, 255)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, 1, 0, "C", fill=True)
        self.ln()
        self.set_text_color(0, 0, 0)
        self.set_font("Arial", "", 8)
        fill = False
        for row in rows:
            if fill:
                self.set_fill_color(240, 243, 250)
            else:
                self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 6, str(cell), 1, 0, "C", fill=True)
            self.ln()
            fill = not fill
        self.ln(3)

    def add_warning_box(self, text):
        self.set_fill_color(255, 240, 200)
        self.set_draw_color(200, 150, 0)
        self.set_font("Arial", "B", 9)
        self.cell(0, 7, "  WARNING", 1, 1, "L", fill=True)
        self.set_font("Arial", "", 8)
        self.set_fill_color(255, 250, 235)
        self.multi_cell(0, 5, text, 1, fill=True)
        self.set_draw_color(0, 0, 0)
        self.ln(3)

    def add_note_box(self, text):
        self.set_fill_color(220, 235, 255)
        self.set_draw_color(0, 100, 200)
        self.set_font("Arial", "B", 9)
        self.cell(0, 7, "  NOTE", 1, 1, "L", fill=True)
        self.set_font("Arial", "", 8)
        self.set_fill_color(235, 245, 255)
        self.multi_cell(0, 5, text, 1, fill=True)
        self.set_draw_color(0, 0, 0)
        self.ln(3)

    def add_numbered_list(self, items):
        self.set_font("Arial", "", 9)
        for i, item in enumerate(items, 1):
            self.cell(8, 5, f"{i}.", 0, 0)
            self.multi_cell(0, 5, item)
            self.ln(1)
        self.ln(2)

    def add_bullet_list(self, items):
        self.set_font("Arial", "", 9)
        for item in items:
            x = self.get_x()
            self.cell(5, 5, chr(149), 0, 0)
            self.multi_cell(0, 5, f" {item}")
        self.ln(2)


def build_cover_page(pdf, prod):
    """Page 1: Title / Cover page"""
    pdf.add_page()
    pdf.ln(30)
    pdf.set_font("Arial", "B", 28)
    pdf.cell(0, 14, prod["product_name"], 0, 1, "C")
    pdf.ln(5)
    pdf.set_font("Arial", "", 14)
    pdf.cell(0, 8, f"Technical Datasheet & Installation Manual", 0, 1, "C")
    pdf.ln(8)
    pdf.set_draw_color(0, 80, 160)
    pdf.set_line_width(1.5)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())
    pdf.ln(10)
    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 8, f"Model: {prod['sku']}", 0, 1, "C")
    pdf.cell(0, 8, f"Manufacturer: {prod['manufacturer']}", 0, 1, "C")
    pdf.cell(0, 8, f"Category: {prod['category']}", 0, 1, "C")
    pdf.cell(0, 8, f"ETIM Code: {prod['etim']}", 0, 1, "C")
    pdf.ln(20)
    pdf.set_font("Arial", "I", 10)
    pdf.cell(0, 6, f"Document Number: {prod['doc_number']}", 0, 1, "C")
    pdf.cell(0, 6, "Revision: B  |  Date: January 2025", 0, 1, "C")
    pdf.cell(0, 6, "Classification: Public", 0, 1, "C")
    pdf.ln(15)
    pdf.set_font("Arial", "", 8)
    pdf.multi_cell(0, 4, f"Copyright 2025 {prod['manufacturer']}. All rights reserved. This document contains proprietary information. "
                         f"No part of this document may be reproduced without prior written consent of {prod['manufacturer']}. "
                         f"Specifications subject to change without notice.", 0, "C")


def build_toc(pdf):
    """Page 2: Table of Contents"""
    pdf.add_page()
    pdf.section_title("TABLE OF CONTENTS")
    pdf.set_font("Arial", "", 10)
    sections = [
        ("1.", "Product Overview", "3"),
        ("2.", "Technical Specifications", "4"),
        ("3.", "Electrical Ratings & Wiring", "6"),
        ("4.", "Mechanical Dimensions", "8"),
        ("5.", "Operating Conditions & Environment", "9"),
        ("6.", "Materials of Construction", "10"),
        ("7.", "Performance Data & Curves", "11"),
        ("8.", "Installation Instructions", "13"),
        ("9.", "Commissioning & Start-up", "15"),
        ("10.", "Wiring Diagrams & Connections", "16"),
        ("11.", "Configuration & Programming", "17"),
        ("12.", "Maintenance & Troubleshooting", "18"),
        ("13.", "Safety Information", "20"),
        ("14.", "Ordering Information & Accessories", "21"),
        ("15.", "Certifications & Compliance", "23"),
        ("16.", "Quality Assurance & Testing", "24"),
        ("17.", "Environmental Testing Results", "25"),
        ("18.", "Application Notes", "26"),
        ("19.", "Warranty & Support", "27"),
        ("20.", "Revision History", "28"),
    ]
    for num, title, page in sections:
        pdf.set_font("Arial", "B", 10)
        pdf.cell(10, 7, num, 0, 0)
        pdf.set_font("Arial", "", 10)
        pdf.cell(140, 7, title, 0, 0)
        dots = "." * (40 - len(title))
        pdf.cell(20, 7, f"{dots} {page}", 0, 1, "R")


def build_overview(pdf, prod):
    """Pages 3-4: Product Overview"""
    pdf.add_page()
    pdf.section_title("PRODUCT OVERVIEW", "1")
    pdf.sub_section("1.1 Description")
    pdf.add_paragraph(prod["overview"])
    pdf.add_paragraph(
        f"The {prod['sku']} is engineered to meet the demanding requirements of modern industrial processes. "
        f"Built by {prod['manufacturer']}, this product represents years of engineering expertise and rigorous "
        f"testing to ensure reliable operation in harsh industrial environments. The device features state-of-the-art "
        f"technology combined with robust construction to deliver exceptional performance and long service life."
    )
    pdf.sub_section("1.2 Key Features")
    pdf.add_bullet_list(prod.get("features", [
        "High accuracy and repeatability for demanding applications",
        "Robust construction for harsh industrial environments",
        "Wide operating temperature range",
        "Multiple output options and communication protocols",
        "Easy installation and commissioning",
        "Low maintenance requirements",
        "Comprehensive diagnostics and self-monitoring",
        "Compact design for space-constrained installations",
        f"Full compliance with international standards ({', '.join(prod['certifications'][:3])})",
        "Long operational lifetime and warranty coverage",
    ]))
    pdf.sub_section("1.3 Applications")
    pdf.add_paragraph(
        f"The {prod['product_name']} is designed for use in a wide range of industrial applications including:"
    )
    pdf.add_bullet_list(prod.get("applications", [
        "Chemical and petrochemical processing plants",
        "Oil and gas production and refining",
        "Water and wastewater treatment facilities",
        "Food and beverage manufacturing",
        "Pharmaceutical and biotech production",
        "Power generation and distribution",
        "Pulp and paper mills",
        "Mining and mineral processing",
        "HVAC and building automation systems",
        "Semiconductor and electronics manufacturing",
        "Automotive and general manufacturing",
        "Marine and offshore installations",
    ]))
    pdf.sub_section("1.4 Principle of Operation")
    pdf.add_paragraph(prod.get("principle", (
        f"The {prod['sku']} operates using advanced sensing and control technology. The primary sensing element "
        f"converts the physical measurement into an electrical signal which is then processed by the integrated "
        f"microprocessor. The digital signal processing provides linearization, temperature compensation, and "
        f"filtering to ensure accurate and stable output. The processed signal is then converted to the selected "
        f"output format (analog, digital, or fieldbus) for transmission to the control system. Comprehensive "
        f"self-diagnostics continuously monitor the device health and alert operators to any abnormal conditions."
    )))


def build_specs(pdf, prod):
    """Pages 4-5: Technical Specifications"""
    pdf.add_page()
    pdf.section_title("TECHNICAL SPECIFICATIONS", "2")
    pdf.sub_section("2.1 General Specifications")
    for label, value in prod["specs"]:
        pdf.add_spec_row(label, value)
    pdf.ln(3)
    pdf.sub_section("2.2 Additional Parameters")
    for label, value in prod.get("specs_extra", [
        ("Standards Compliance", f"IEC, EN, ANSI ({prod['category']} specific)"),
        ("Quality System", "ISO 9001:2015 certified production"),
        ("Country of Origin", "Germany / USA"),
        ("Typical Service Life", "> 20 years under normal conditions"),
        ("Mean Time Between Failures", "> 150,000 hours"),
        ("Warranty Period", "3 years from date of delivery"),
        ("Recommended Calibration", "Every 12-24 months"),
        ("Software Version", "Firmware V3.2.1"),
    ]):
        pdf.add_spec_row(label, value)
    pdf.ln(3)
    pdf.sub_section("2.3 Specification Summary Table")
    pdf.add_table(
        prod.get("summary_headers", ["Parameter", "Min", "Typical", "Max", "Unit"]),
        prod.get("summary_rows", prod["table_rows"])
    )


def build_electrical(pdf, prod):
    """Pages 6-7: Electrical"""
    pdf.add_page()
    pdf.section_title("ELECTRICAL RATINGS & WIRING", "3")
    pdf.sub_section("3.1 Electrical Specifications")
    for label, value in prod["electrical"]:
        pdf.add_spec_row(label, value)
    pdf.ln(3)
    pdf.sub_section("3.2 Electrical Safety")
    pdf.add_paragraph(
        "All electrical connections must be made by qualified personnel in accordance with local electrical codes "
        "and regulations. Ensure that the supply voltage matches the device rating before energizing. Use appropriate "
        "circuit protection (fuses/breakers) as specified in this document."
    )
    pdf.add_warning_box(
        "DANGER: Risk of electric shock. Disconnect all power sources before performing any wiring or maintenance. "
        "Allow a minimum of 5 minutes for capacitors to discharge after power is removed. Verify absence of voltage "
        "with a suitable measuring instrument before touching any conductors."
    )
    pdf.sub_section("3.3 EMC Considerations")
    pdf.add_paragraph(
        "This product has been designed and tested to comply with applicable EMC standards. To maintain EMC performance "
        "in the installed system, observe the following guidelines:"
    )
    pdf.add_bullet_list([
        "Use shielded cables for all signal connections, grounding the shield at one end",
        "Route signal cables separately from power cables (minimum 200 mm separation)",
        "Install appropriate surge protection devices on all field wiring",
        "Use twisted pair cables for analog signals to minimize interference",
        "Connect the device grounding terminal to the plant ground system",
        "Keep cable runs as short as possible",
        "Avoid routing cables near high-frequency switching devices (VFDs, contactors)",
    ])
    pdf.sub_section("3.4 Wire Sizing Guide")
    pdf.add_table(
        ["Wire Size (mm2)", "Wire Size (AWG)", "Max Length (m)", "Current Capacity (A)", "Application"],
        [
            ["0.5", "20", "50", "3", "Signal / sensor"],
            ["0.75", "18", "75", "5", "Low power"],
            ["1.0", "17", "100", "8", "General"],
            ["1.5", "16", "150", "12", "Power supply"],
            ["2.5", "14", "200", "16", "Motor / heater"],
            ["4.0", "12", "250", "25", "High power"],
        ]
    )


def build_dimensions(pdf, prod):
    """Pages 8-9: Dimensions"""
    pdf.add_page()
    pdf.section_title("MECHANICAL DIMENSIONS", "4")
    pdf.sub_section("4.1 Physical Dimensions")
    for label, value in prod["dimensions"]:
        pdf.add_spec_row(label, value)
    pdf.ln(3)
    pdf.sub_section("4.2 Dimensional Drawing Reference")
    pdf.add_paragraph(
        f"All dimensions are in millimeters unless otherwise stated. Tolerances are per ISO 2768-mK. "
        f"For detailed 2D/3D CAD models, please visit the {prod['manufacturer']} download portal or contact "
        f"your local sales representative."
    )
    pdf.add_note_box(
        f"CAD models available in STEP, IGES, and DXF formats at www.{prod['manufacturer'].lower().replace(' ', '')}.com/downloads"
    )
    pdf.sub_section("4.3 Mounting Instructions")
    pdf.add_paragraph(
        "The device must be mounted in accordance with the following guidelines to ensure proper operation "
        "and to maintain the specified ingress protection rating:"
    )
    pdf.add_numbered_list([
        "Select a mounting location that provides adequate clearance for wiring and maintenance access.",
        "Ensure the mounting surface is flat, clean, and capable of supporting the device weight plus dynamic loads.",
        "Use the specified fasteners and torque values. Do not over-tighten as this may damage the housing.",
        "Apply thread sealant (PTFE tape or liquid sealant) to all process connections as required.",
        "Verify that the process connection type and rating match the installation requirements.",
        "Orient the device as shown in the dimensional drawing for optimal performance.",
        "Maintain the minimum clearances specified below for proper ventilation and heat dissipation.",
        "Ensure all cable entries are properly sealed with the supplied cable glands.",
    ])
    pdf.sub_section("4.4 Clearance Requirements")
    pdf.add_table(
        ["Direction", "Minimum Clearance (mm)", "Recommended Clearance (mm)", "Purpose"],
        [
            ["Top", "30", "50", "Ventilation / heat dissipation"],
            ["Bottom", "30", "50", "Cable routing"],
            ["Left side", "15", "30", "Adjacent device clearance"],
            ["Right side", "15", "30", "Adjacent device clearance"],
            ["Front", "50", "100", "Maintenance / display access"],
        ]
    )


def build_operating(pdf, prod):
    """Pages 9-10: Operating Conditions"""
    pdf.add_page()
    pdf.section_title("OPERATING CONDITIONS & ENVIRONMENT", "5")
    pdf.sub_section("5.1 Environmental Ratings")
    for label, value in prod["operating"]:
        pdf.add_spec_row(label, value)
    pdf.ln(3)
    pdf.sub_section("5.2 Derating Information")
    pdf.add_paragraph(
        "The device is rated for full performance within the specified operating temperature range. "
        "When operating outside the standard range, the following derating factors apply:"
    )
    pdf.add_table(
        ["Ambient Temperature", "Max Output", "Accuracy Impact", "Lifetime Factor"],
        [
            ["-40 to -20 C", "90%", "+0.1% FS", "0.95x"],
            ["-20 to 0 C", "95%", "+0.05% FS", "1.0x"],
            ["0 to 40 C", "100%", "Nominal", "1.0x"],
            ["40 to 60 C", "95%", "+0.05% FS", "0.95x"],
            ["60 to 70 C", "85%", "+0.1% FS", "0.85x"],
            ["70 to 85 C", "75%", "+0.2% FS", "0.70x"],
        ]
    )
    pdf.sub_section("5.3 Environmental Protection")
    pdf.add_paragraph(
        f"The {prod['sku']} is designed for installation in industrial environments. The enclosure provides "
        f"protection against ingress of solid objects and water as specified by the IP rating. Additional "
        f"protection measures may be required for installation in corrosive atmospheres, high-vibration "
        f"environments, or areas subject to direct solar radiation."
    )
    pdf.add_bullet_list([
        "For outdoor installations, use a weather-protection enclosure or sun shield",
        "In corrosive environments, specify optional protective coatings",
        "For high-vibration areas, use vibration dampening mounts",
        "In wash-down areas, verify that the IP rating is sufficient for the cleaning procedures used",
        "For installations in classified hazardous areas, ensure compliance with applicable ATEX/IECEx requirements",
    ])


def build_materials(pdf, prod):
    """Page 10: Materials"""
    pdf.add_page()
    pdf.section_title("MATERIALS OF CONSTRUCTION", "6")
    pdf.sub_section("6.1 Material Specifications")
    for label, value in prod["materials"]:
        pdf.add_spec_row(label, value)
    pdf.ln(3)
    pdf.sub_section("6.2 Chemical Compatibility")
    pdf.add_paragraph(
        "The wetted materials have been selected for broad chemical compatibility. However, the suitability "
        "of materials for specific process fluids must be verified by the end user. The following table provides "
        "general guidance on material compatibility with common process media:"
    )
    pdf.add_table(
        ["Medium", "316L SS", "Hastelloy C", "PTFE", "FKM", "EPDM", "NBR"],
        [
            ["Water (neutral)", "A", "A", "A", "A", "A", "A"],
            ["Sulfuric Acid (<50%)", "B", "A", "A", "B", "B", "C"],
            ["Hydrochloric Acid", "C", "A", "A", "B", "C", "C"],
            ["Sodium Hydroxide", "A", "A", "A", "A", "A", "A"],
            ["Ammonia", "A", "A", "A", "C", "A", "C"],
            ["Diesel / Fuel Oil", "A", "A", "A", "A", "C", "A"],
            ["Acetic Acid", "B", "A", "A", "C", "B", "C"],
            ["Chlorine (gas)", "C", "A", "A", "A", "C", "C"],
        ]
    )
    pdf.set_font("Arial", "I", 8)
    pdf.cell(0, 5, "A = Excellent  |  B = Good (limited life)  |  C = Not recommended  |  Contact factory for specific media", 0, 1)
    pdf.ln(3)
    pdf.sub_section("6.3 Material Certificates")
    pdf.add_paragraph(
        "Material certificates (EN 10204 Type 3.1) are available for all wetted parts upon request. "
        "Please specify material certificate requirements at the time of ordering. "
        "Positive Material Identification (PMI) testing can be performed on request for critical applications."
    )


def build_performance(pdf, prod):
    """Pages 11-12: Performance Data"""
    pdf.add_page()
    pdf.section_title("PERFORMANCE DATA & CURVES", "7")
    pdf.sub_section("7.1 Performance Summary Table")
    pdf.add_table(prod["table_headers"], prod["table_rows"])
    
    pdf.sub_section("7.2 Accuracy & Error Budget")
    pdf.add_table(
        ["Error Source", "Contribution (%FS)", "Conditions", "Notes"],
        [
            ["Non-linearity", "0.05", "BFSL method", "Includes hysteresis"],
            ["Hysteresis", "0.02", "Full range cycle", "Max value"],
            ["Repeatability", "0.01", "Same conditions", "Short-term"],
            ["Temp. effect (zero)", "0.02/10K", "Over comp. range", "Per 10K change"],
            ["Temp. effect (span)", "0.02/10K", "Over comp. range", "Per 10K change"],
            ["Long-term drift", "0.1/year", "Normal conditions", "Annual maximum"],
            ["Supply voltage effect", "0.005/V", "Within rated range", "Per volt change"],
            ["Total uncertainty", "< 0.15", "RSS method", "95% confidence"],
        ]
    )
    pdf.sub_section("7.3 Response Characteristics")
    pdf.add_paragraph(
        f"The {prod['sku']} response time is measured as the time required for the output to reach within "
        f"a specified percentage of its final value following a step change in the input. The response time "
        f"is affected by the damping setting, digital filter configuration, and the physical characteristics "
        f"of the installation."
    )
    pdf.add_table(
        ["Damping Setting", "Response Time (t63)", "Response Time (t90)", "Response Time (t99)", "Update Rate"],
        [
            ["Off (fastest)", "< 5 ms", "< 12 ms", "< 25 ms", "100 Hz"],
            ["Low", "50 ms", "115 ms", "250 ms", "20 Hz"],
            ["Medium", "200 ms", "460 ms", "1.0 s", "5 Hz"],
            ["High", "1.0 s", "2.3 s", "5.0 s", "1 Hz"],
            ["Custom", "Programmable", "---", "---", "Variable"],
        ]
    )
    pdf.sub_section("7.4 Long-term Stability Test Results")
    pdf.add_paragraph(
        "The following data represents typical long-term stability test results measured over a 12-month period "
        "at reference conditions (23 +/- 2 deg C, 45 +/- 10% RH):"
    )
    pdf.add_table(
        ["Test Duration", "Zero Drift (%FS)", "Span Drift (%FS)", "Total Drift (%FS)", "Pass/Fail"],
        [
            ["1 month", "< 0.01", "< 0.01", "< 0.02", "PASS"],
            ["3 months", "< 0.02", "< 0.02", "< 0.04", "PASS"],
            ["6 months", "< 0.04", "< 0.03", "< 0.07", "PASS"],
            ["12 months", "< 0.06", "< 0.05", "< 0.10", "PASS"],
        ]
    )


def build_installation(pdf, prod):
    """Pages 13-14: Installation"""
    pdf.add_page()
    pdf.section_title("INSTALLATION INSTRUCTIONS", "8")
    pdf.add_warning_box(
        "Read all instructions carefully before beginning installation. Improper installation may result in "
        "damage to the device, personal injury, or death. Installation must be performed by qualified personnel "
        "trained in the installation of industrial instrumentation and familiar with applicable safety regulations."
    )
    pdf.sub_section("8.1 Pre-Installation Checklist")
    pdf.add_numbered_list([
        "Verify that the received product matches the purchase order (model, range, options).",
        "Inspect the device for any shipping damage. Report any damage to the carrier immediately.",
        "Verify that the process conditions (pressure, temperature, media) are within the device ratings.",
        "Ensure that all required tools, fittings, and accessories are available.",
        "Review the installation location for accessibility, environmental conditions, and safety.",
        "Verify that the electrical supply matches the device requirements.",
        "Prepare all process connections with appropriate thread sealant.",
        "Ensure the process is depressurized and drained before installation.",
    ])
    pdf.sub_section("8.2 Mechanical Installation")
    pdf.add_paragraph(
        f"Mount the {prod['sku']} according to the dimensional drawing provided in Section 4. Follow these "
        f"steps for proper mechanical installation:"
    )
    pdf.add_numbered_list([
        f"Clean the process connection point thoroughly. Remove any burrs, debris, or old sealant material.",
        f"Apply 2-3 wraps of PTFE tape (or approved liquid sealant) to the male thread connection.",
        f"Hand-tighten the device into the process connection until finger-tight.",
        f"Use the appropriate wrench to tighten the connection to the specified torque value (see table below).",
        f"Do NOT use the device housing or electrical connector as a lever point during tightening.",
        f"Verify that the device is oriented correctly for the intended measurement.",
        f"Install any required mounting brackets or supports as needed.",
        f"Connect the impulse piping or process tubing if applicable.",
    ])
    pdf.sub_section("8.3 Torque Specifications")
    pdf.add_table(
        ["Connection Type", "Size", "Torque (Nm)", "Torque (ft-lbs)", "Tool"],
        [
            ["NPT male", "1/4 NPT", "15-20", "11-15", "17 mm wrench"],
            ["NPT male", "1/2 NPT", "25-35", "18-26", "22 mm wrench"],
            ["G (BSP) male", "G 1/4", "20-25", "15-18", "19 mm wrench"],
            ["G (BSP) male", "G 1/2", "30-40", "22-30", "27 mm wrench"],
            ["Flange bolts", "M12", "60-80", "44-59", "19 mm socket"],
            ["Flange bolts", "M16", "120-160", "88-118", "24 mm socket"],
            ["Cable gland", "M20", "5-8", "4-6", "25 mm wrench"],
        ]
    )
    pdf.sub_section("8.4 Electrical Installation")
    pdf.add_paragraph(
        "After completing the mechanical installation, proceed with the electrical connections:"
    )
    pdf.add_numbered_list([
        "Ensure all power sources are disconnected and locked out (LOTO procedure).",
        "Remove the terminal cover or connector cap from the device.",
        "Strip the cable conductors to the specified length (typically 7-10 mm).",
        "Connect the wires according to the wiring diagram in Section 10.",
        "Ensure cable shields are connected to the ground terminal (if applicable).",
        "Tighten all terminal screws to 0.5-0.8 Nm (do not over-tighten).",
        "Verify all connections with a continuity tester before applying power.",
        "Install cable glands and seal all cable entries to maintain IP rating.",
        "Replace the terminal cover and secure with the provided fastener.",
        "Apply power and verify device operation according to Section 9.",
    ])


def build_commissioning(pdf, prod):
    """Page 15: Commissioning"""
    pdf.add_page()
    pdf.section_title("COMMISSIONING & START-UP", "9")
    pdf.sub_section("9.1 Initial Power-Up")
    pdf.add_paragraph(
        f"After completing the mechanical and electrical installation, follow this procedure for initial "
        f"start-up of the {prod['sku']}:"
    )
    pdf.add_numbered_list([
        "Apply power to the device. The display (if equipped) should illuminate within 2 seconds.",
        "Observe the self-diagnostic sequence. The device performs a complete self-test during power-up.",
        "Wait for the self-test to complete (approximately 5-10 seconds). A steady output indicates normal operation.",
        "Verify the output signal is within the expected range using a calibrated multimeter or test instrument.",
        "If the device has a display, verify that the reading corresponds to the actual process condition.",
        "If the output or reading is not as expected, refer to Section 12 (Troubleshooting).",
    ])
    pdf.sub_section("9.2 Zero and Span Adjustment")
    pdf.add_paragraph(
        "The device is factory-calibrated and should not require adjustment under normal circumstances. "
        "If field adjustment is necessary, follow this procedure:"
    )
    pdf.add_numbered_list([
        "Apply the zero reference condition (e.g., atmospheric pressure, 0 flow, ambient temperature).",
        "Wait for the reading to stabilize (minimum 30 seconds).",
        "Access the configuration menu: Press and hold [SET] button for 3 seconds.",
        "Navigate to CALIBRATION > ZERO ADJUST.",
        "Press [ENTER] to perform the zero adjustment.",
        "Apply the span reference condition using a calibrated reference standard.",
        "Navigate to CALIBRATION > SPAN ADJUST.",
        "Press [ENTER] to perform the span adjustment.",
        "Verify the calibration at 0%, 25%, 50%, 75%, and 100% of range.",
        "Record the as-found and as-left calibration values.",
    ])
    pdf.sub_section("9.3 Commissioning Checklist")
    pdf.add_table(
        ["Check Item", "Requirement", "Result", "Initials"],
        [
            ["Power supply voltage", "Within rated range", "______", "______"],
            ["Output at zero", "4.00 +/- 0.02 mA", "______", "______"],
            ["Output at span", "20.00 +/- 0.02 mA", "______", "______"],
            ["Display reading", "Matches reference", "______", "______"],
            ["Alarm setpoints", "Per specification", "______", "______"],
            ["Communication", "Response to polling", "______", "______"],
            ["Leak test", "No leaks at rated P", "______", "______"],
            ["Documentation", "As-built recorded", "______", "______"],
        ]
    )


def build_wiring(pdf, prod):
    """Page 16: Wiring Diagrams"""
    pdf.add_page()
    pdf.section_title("WIRING DIAGRAMS & CONNECTIONS", "10")
    pdf.sub_section("10.1 Terminal Assignment")
    pdf.add_table(
        ["Terminal", "Function", "Wire Color", "Description"],
        [
            ["1 (+)", "Supply / Signal +", "Brown / Red", "Positive supply and signal output"],
            ["2 (-)", "Supply / Signal -", "Blue / Black", "Negative supply / signal return"],
            ["3", "Output 2 / Alarm", "White", "Secondary output or alarm relay"],
            ["4", "Shield / Ground", "Green/Yellow", "Cable shield connection"],
            ["5", "Communication +", "White/Green", "RS485 / HART data (+)"],
            ["6", "Communication -", "White/Brown", "RS485 / HART data (-)"],
        ]
    )
    pdf.sub_section("10.2 Connection Configurations")
    pdf.add_paragraph("2-Wire Connection (4-20 mA loop powered):")
    pdf.add_paragraph(
        "  Power Supply (+) ---- Terminal 1 (+) ---- Device ---- Terminal 2 (-) ---- Receiver ---- Power Supply (-)"
    )
    pdf.ln(2)
    pdf.add_paragraph("4-Wire Connection (separate power and signal):")
    pdf.add_paragraph(
        "  Power Supply (+) ---- Terminal 1 (+)\n"
        "  Power Supply (-) ---- Terminal 2 (-)\n"
        "  Signal Output ---- Terminal 3 ---- Receiver Input (+)\n"
        "  Signal Return ---- Terminal 4 ---- Receiver Input (-)"
    )
    pdf.sub_section("10.3 HART Communication Wiring")
    pdf.add_paragraph(
        "For HART communication, connect the HART communicator or modem across terminals 1 and 2. "
        "The minimum loop resistance for HART communication is 250 ohm. If the loop resistance is less "
        "than 250 ohm, install a 250 ohm resistor in series with the loop."
    )
    pdf.add_note_box(
        "HART communication requires a minimum loop impedance of 250 ohm at the HART signal frequency (1200/2200 Hz). "
        "Many modern transmitters include built-in loop resistance measurement - check the diagnostics menu."
    )


def build_configuration(pdf, prod):
    """Page 17: Configuration"""
    pdf.add_page()
    pdf.section_title("CONFIGURATION & PROGRAMMING", "11")
    pdf.sub_section("11.1 Parameter Overview")
    pdf.add_table(
        ["Parameter", "Range", "Default", "Access Level", "Description"],
        [
            ["Unit", "Bar/PSI/kPa/MPa", "Bar", "Basic", "Engineering unit"],
            ["Range Low", "-100 to +99% FS", "0.0", "Basic", "Lower range value"],
            ["Range High", "+1 to +100% FS", "100.0", "Basic", "Upper range value"],
            ["Damping", "0.0 to 60.0 s", "0.5 s", "Basic", "Output damping time"],
            ["Output Mode", "Linear/Sqrt/Custom", "Linear", "Advanced", "Transfer function"],
            ["Alarm Type", "Hi/Lo/Window/Rate", "Hi", "Advanced", "Alarm mode"],
            ["Alarm Setpoint", "Within range", "90% FS", "Advanced", "Alarm trigger point"],
            ["Fail-safe", "Hi/Lo/Hold/Custom", "Hi", "Advanced", "Output on fault"],
            ["Display", "Value/Bar/Both/%", "Value", "Basic", "Display format"],
            ["Protocol Address", "0-247", "1", "Service", "Modbus/HART address"],
        ],
        col_widths=[30, 35, 25, 25, 75]
    )
    pdf.sub_section("11.2 Menu Structure")
    pdf.add_paragraph("The device configuration is organized in the following menu hierarchy:")
    pdf.add_paragraph(
        "MAIN MENU\n"
        "  |-- DISPLAY\n"
        "  |     |-- Unit, Format, Orientation, Contrast\n"
        "  |-- MEASUREMENT\n"
        "  |     |-- Range, Damping, Filter, Output Mode\n"
        "  |-- OUTPUT\n"
        "  |     |-- Analog Output, Alarm, Simulation\n"
        "  |-- COMMUNICATION\n"
        "  |     |-- HART, Modbus, Device Tag, Polling Address\n"
        "  |-- DIAGNOSTICS\n"
        "  |     |-- Self Test, Peak Hold, Error Log, Runtime Counter\n"
        "  |-- CALIBRATION\n"
        "        |-- Zero, Span, Trim, Factory Reset"
    )
    pdf.sub_section("11.3 Configuration via HART")
    pdf.add_paragraph(
        "The device supports HART 7 protocol for remote configuration. Use any HART-compatible communicator "
        "or asset management software (e.g., PACTware, Endress+Hauser FieldCare, Emerson AMS) to access all "
        "device parameters remotely via the 4-20 mA loop."
    )


def build_maintenance(pdf, prod):
    """Pages 18-19: Maintenance & Troubleshooting"""
    pdf.add_page()
    pdf.section_title("MAINTENANCE & TROUBLESHOOTING", "12")
    pdf.sub_section("12.1 Preventive Maintenance Schedule")
    pdf.add_table(
        ["Task", "Interval", "Estimated Time", "Skill Level", "Parts Required"],
        [
            ["Visual inspection", "Monthly", "5 min", "Operator", "None"],
            ["Verify output signal", "Quarterly", "15 min", "Technician", "Multimeter"],
            ["Check connections", "Semi-annual", "15 min", "Technician", "Torque wrench"],
            ["Calibration check", "Annual", "30 min", "Specialist", "Reference standard"],
            ["Full calibration", "2 years", "60 min", "Specialist", "Reference standard"],
            ["Seal / gasket check", "2 years", "30 min", "Technician", "Seal kit (optional)"],
            ["Replace desiccant", "Annual", "5 min", "Operator", "Desiccant pack"],
            ["Firmware update", "As available", "15 min", "Specialist", "Communicator / PC"],
        ]
    )
    pdf.sub_section("12.2 Troubleshooting Guide")
    pdf.add_table(
        ["Symptom", "Possible Cause", "Corrective Action"],
        [
            ["No output", "No power supply", "Check supply voltage at terminals"],
            ["No output", "Wiring fault", "Verify connections per wiring diagram"],
            ["No output", "Device fault", "Check diagnostic LED / error code"],
            ["Erratic reading", "Electrical noise", "Check cable routing and shielding"],
            ["Erratic reading", "Process turbulence", "Increase damping setting"],
            ["Erratic reading", "Loose connection", "Tighten all terminals"],
            ["Offset error", "Zero drift", "Perform zero calibration"],
            ["Span error", "Span drift", "Perform span calibration"],
            ["Over-range", "Process excursion", "Verify process conditions"],
            ["Over-range", "Blocked line", "Inspect impulse tubing"],
            ["Communication fail", "Wrong address", "Verify protocol address setting"],
            ["Communication fail", "Baud rate mismatch", "Match baud rate to host"],
            ["High temperature alarm", "Excess ambient temp", "Improve ventilation or relocate"],
            ["Sensor fault", "Sensor damage", "Replace device or sensor element"],
        ],
        col_widths=[40, 50, 100]
    )
    pdf.sub_section("12.3 Error Codes")
    pdf.add_table(
        ["Error Code", "Description", "Severity", "Action Required"],
        [
            ["E001", "Sensor open circuit", "Critical", "Check sensor wiring, replace if needed"],
            ["E002", "Sensor short circuit", "Critical", "Check sensor wiring, replace if needed"],
            ["E003", "Over-range (high)", "Warning", "Verify process, adjust range if needed"],
            ["E004", "Under-range (low)", "Warning", "Verify process, adjust range if needed"],
            ["E005", "Temperature compensation error", "Warning", "Allow device to reach thermal equilibrium"],
            ["E010", "EEPROM write error", "Critical", "Cycle power, contact factory if persistent"],
            ["E011", "Calibration data invalid", "Critical", "Perform factory reset and recalibrate"],
            ["E020", "Communication timeout", "Info", "Check communication wiring and settings"],
        ],
        col_widths=[25, 55, 25, 85]
    )


def build_safety(pdf, prod):
    """Page 20: Safety"""
    pdf.add_page()
    pdf.section_title("SAFETY INFORMATION", "13")
    pdf.add_warning_box(
        "READ ALL SAFETY INFORMATION BEFORE INSTALLING, OPERATING, OR SERVICING THIS DEVICE. "
        "FAILURE TO FOLLOW THESE INSTRUCTIONS MAY RESULT IN DEATH, SERIOUS INJURY, OR PROPERTY DAMAGE."
    )
    pdf.sub_section("13.1 General Safety Precautions")
    pdf.add_bullet_list([
        "This device must be installed, operated, and maintained by qualified personnel only.",
        "Follow all applicable local, national, and international safety codes and regulations.",
        "Always use appropriate personal protective equipment (PPE) when working on process equipment.",
        "Depressurize and drain the process before installing or removing the device.",
        "Disconnect and lock out all energy sources before performing any maintenance work.",
        "Do not exceed the rated pressure, temperature, or voltage specified in this document.",
        "Do not modify or alter the device in any way. Unauthorized modifications void the warranty and certifications.",
        "If the device is damaged or suspected of malfunction, remove it from service immediately.",
        "Dispose of the device in accordance with local environmental regulations at end of life.",
    ])
    pdf.sub_section("13.2 Hazardous Area Safety")
    pdf.add_paragraph(
        "If this device is certified for use in hazardous (classified) areas (ATEX, IECEx, FM, CSA), the following "
        "additional precautions apply:"
    )
    pdf.add_bullet_list([
        "Verify that the device certification matches the area classification before installation.",
        "Use only certified cable glands, conduit fittings, and accessories in the hazardous area.",
        "Do not open the device housing or disconnect wiring in a potentially explosive atmosphere.",
        "Maintain the specified maximum surface temperature (T-class) under all operating conditions.",
        "Refer to the device-specific ATEX/IECEx certificate for special conditions of use.",
    ])
    pdf.sub_section("13.3 Pressure Equipment Safety (PED)")
    pdf.add_paragraph(
        f"The {prod['sku']} may be subject to the Pressure Equipment Directive (PED 2014/68/EU) depending on "
        f"the process conditions and fluid group. Refer to the PED classification table provided with the device "
        f"certification documentation. The user is responsible for ensuring compliance with PED requirements "
        f"in the installed system."
    )


def build_ordering(pdf, prod):
    """Pages 21-22: Ordering"""
    pdf.add_page()
    pdf.section_title("ORDERING INFORMATION & ACCESSORIES", "14")
    pdf.sub_section("14.1 Model Number Structure")
    parts = prod["sku"].split("-")
    pdf.add_paragraph(f"Model: {prod['sku']}")
    pdf.add_paragraph(
        f"The model number is structured as follows:\n"
        f"  {parts[0]} = Product family / base model\n"
        + (f"  {parts[1]} = Configuration / variant\n" if len(parts) > 1 else "")
        + (f"  {parts[2]} = Material / option code\n" if len(parts) > 2 else "")
    )
    pdf.sub_section("14.2 Available Options")
    pdf.add_table(
        ["Option Code", "Description", "Price Impact", "Lead Time"],
        [
            ["STD", "Standard configuration", "Base price", "2-4 weeks"],
            ["-SS", "316L stainless steel wetted parts", "+15%", "2-4 weeks"],
            ["-HC", "Hastelloy C-276 wetted parts", "+45%", "6-8 weeks"],
            ["-TI", "Titanium wetted parts", "+65%", "8-10 weeks"],
            ["-HT", "High temperature version (-40 to 200 C)", "+20%", "4-6 weeks"],
            ["-CT", "Cryogenic version (-196 to 100 C)", "+25%", "6-8 weeks"],
            ["-HART", "HART 7 communication", "+10%", "Standard"],
            ["-FF", "Foundation Fieldbus", "+20%", "4-6 weeks"],
            ["-PA", "PROFIBUS PA", "+20%", "4-6 weeks"],
            ["-ATEX", "ATEX/IECEx Zone 0 certification", "+15%", "2-4 weeks"],
            ["-SIL", "SIL 2/3 certification", "+20%", "4-6 weeks"],
            ["-CAL", "5-point NIST traceable calibration", "+5%", "Standard"],
        ]
    )
    pdf.sub_section("14.3 Recommended Spare Parts")
    pdf.add_table(
        ["Part Number", "Description", "Quantity", "Recommended Stock"],
        [
            [f"{parts[0]}-SEAL-01", "Process seal kit (FKM)", "1 set", "1 per 5 devices"],
            [f"{parts[0]}-SEAL-02", "Process seal kit (EPDM)", "1 set", "As required"],
            [f"{parts[0]}-GASK-01", "Gasket set", "1 set", "1 per 5 devices"],
            [f"{parts[0]}-GLAND-01", "Cable gland M20, nickel brass", "1 pc", "1 per 10 devices"],
            [f"{parts[0]}-CONN-01", "Electrical connector, 4-pin M12", "1 pc", "1 per 10 devices"],
            [f"{parts[0]}-DESIC-01", "Desiccant pack", "5 pcs", "Annual replacement"],
            [f"{parts[0]}-MOUNT-01", "Mounting bracket set", "1 set", "As required"],
        ]
    )
    pdf.sub_section("14.4 Recommended Accessories")
    pdf.add_table(
        ["Part Number", "Description", "Application"],
        [
            ["ACC-MNT-01", "Pipe mounting kit (2 inch)", "Pipe/pole mounting"],
            ["ACC-MNT-02", "Wall mounting bracket", "Wall/panel mounting"],
            ["ACC-SUN-01", "Sun/weather protection shield", "Outdoor installations"],
            ["ACC-VLV-01", "Manifold valve set (3-valve)", "Isolation and calibration"],
            ["ACC-VLV-02", "Manifold valve set (5-valve)", "Differential with equalize"],
            ["ACC-CAB-05", "Pre-made cable assembly (5 m)", "Quick installation"],
            ["ACC-CAB-10", "Pre-made cable assembly (10 m)", "Quick installation"],
            ["ACC-DSP-01", "Remote display unit", "Display at distance"],
            ["ACC-SPD-01", "Surge protection device", "Lightning protection"],
        ]
    )


def build_certifications(pdf, prod):
    """Pages 23-24: Certifications"""
    pdf.add_page()
    pdf.section_title("CERTIFICATIONS & COMPLIANCE", "15")
    pdf.sub_section("15.1 Regulatory Certifications")
    cert_details = {
        "CE": ("European Conformity", "2014/30/EU (EMC), 2014/35/EU (LVD), 2014/68/EU (PED)", "Full compliance"),
        "ATEX": ("Explosive Atmospheres", "DIRECTIVE 2014/34/EU", "II 1/2 G Ex ia/d IIC T4-T6"),
        "IECEx": ("International Ex", "IECEx scheme", "Ex ia/d IIC T4-T6 Gb"),
        "UL": ("Underwriters Laboratories", "UL 508, UL 61010-1", "Listed / Recognized"),
        "CSA": ("Canadian Standards", "CSA C22.2 No. 142", "Certified"),
        "SIL 2/3": ("Functional Safety", "IEC 61508 / IEC 61511", "SIL 2 (single) / SIL 3 (redundant)"),
        "RoHS": ("Hazardous Substances", "2011/65/EU + 2015/863", "Full compliance"),
        "REACH": ("Chemical Registration", "EC 1907/2006", "SVHC declaration available"),
        "FM": ("Factory Mutual", "FM 3600 / 3611", "Approved"),
        "CCC": ("China Compulsory", "GB standards", "Certified"),
    }
    for cert in prod["certifications"]:
        if cert in cert_details:
            name, standard, status = cert_details[cert]
            pdf.set_font("Arial", "B", 9)
            pdf.cell(25, 6, cert, 0, 0)
            pdf.set_font("Arial", "", 9)
            pdf.cell(55, 6, name, 0, 0)
            pdf.cell(65, 6, standard, 0, 0)
            pdf.cell(0, 6, status, 0, 1)
        else:
            pdf.set_font("Arial", "B", 9)
            pdf.cell(25, 6, cert, 0, 0)
            pdf.set_font("Arial", "", 9)
            pdf.cell(0, 6, "Certified / Compliant", 0, 1)
    pdf.ln(3)
    pdf.sub_section("15.2 Declaration of Conformity")
    pdf.add_paragraph(
        f"We, {prod['manufacturer']}, declare under our sole responsibility that the product "
        f"{prod['product_name']} (Model: {prod['sku']}) is in conformity with the provisions of the "
        f"applicable EU Directives and harmonized standards listed above. A copy of the full EU Declaration "
        f"of Conformity is available on request."
    )


def build_quality(pdf, prod):
    """Page 24: Quality"""
    pdf.add_page()
    pdf.section_title("QUALITY ASSURANCE & TESTING", "16")
    pdf.sub_section("16.1 Quality Management System")
    pdf.add_paragraph(
        f"{prod['manufacturer']} maintains a comprehensive quality management system certified to "
        f"ISO 9001:2015. All products are manufactured under controlled conditions with full traceability "
        f"of materials, processes, and test results."
    )
    pdf.sub_section("16.2 Factory Acceptance Testing")
    pdf.add_paragraph("Every device undergoes the following factory acceptance tests before shipment:")
    pdf.add_table(
        ["Test", "Method", "Acceptance Criteria", "Record"],
        [
            ["Visual inspection", "100% visual", "No defects", "Inspection report"],
            ["Dimensional check", "Gauge / CMM", "Per drawing tolerances", "Dimensional report"],
            ["Pressure test", "Hydrostatic 1.5x", "No leaks, no deformation", "Test certificate"],
            ["Electrical safety", "Hi-pot 1500 V AC", "< 1 mA leakage", "Test certificate"],
            ["Insulation resistance", "500 V DC", "> 100 MOhm", "Test certificate"],
            ["Calibration", "5-point up/down", "Within accuracy spec", "Calibration certificate"],
            ["Functional test", "Full operating cycle", "All functions verified", "Test report"],
            ["Communication test", "Protocol verification", "Correct response", "Test report"],
            ["Burn-in", "24-hour power-on", "Stable output", "Data log"],
        ]
    )
    pdf.sub_section("16.3 Traceability")
    pdf.add_paragraph(
        "Each device is assigned a unique serial number that enables complete traceability from raw materials "
        "through manufacturing, testing, and delivery. All test records are maintained for a minimum of 10 years."
    )


def build_environmental(pdf, prod):
    """Page 25: Environmental Testing"""
    pdf.add_page()
    pdf.section_title("ENVIRONMENTAL TESTING RESULTS", "17")
    pdf.sub_section("17.1 Type Test Results")
    pdf.add_table(
        ["Test", "Standard", "Level / Duration", "Result", "Notes"],
        [
            ["Temperature cycling", "IEC 60068-2-14", "-40 to +85 C, 100 cycles", "PASS", "No degradation"],
            ["Dry heat", "IEC 60068-2-2", "+85 C, 96 hours", "PASS", "Within spec"],
            ["Cold", "IEC 60068-2-1", "-40 C, 96 hours", "PASS", "Within spec"],
            ["Humidity (steady)", "IEC 60068-2-78", "40 C / 93% RH, 56 days", "PASS", "No corrosion"],
            ["Humidity (cyclic)", "IEC 60068-2-30", "25-55 C, 6 cycles", "PASS", "No condensation damage"],
            ["Vibration (sinusoidal)", "IEC 60068-2-6", "10-2000 Hz, 20g", "PASS", "No resonance shift"],
            ["Vibration (random)", "IEC 60068-2-64", "10-2000 Hz, 10 grms", "PASS", "Functional during test"],
            ["Shock", "IEC 60068-2-27", "100g, 6 ms, 3 axes", "PASS", "No damage"],
            ["Salt spray", "IEC 60068-2-52", "96 hours, 5% NaCl", "PASS", "No corrosion on SS parts"],
            ["EMC immunity", "EN 61326-1", "Industrial environment", "PASS", "Performance A"],
            ["EMC emissions", "EN 61326-1", "Class A limits", "PASS", "Below limits"],
            ["ESD", "IEC 61000-4-2", "8 kV contact, 15 kV air", "PASS", "Performance A"],
            ["Surge", "IEC 61000-4-5", "2 kV line, 1 kV I/O", "PASS", "Performance B"],
            ["IP rating", "IEC 60529", "IP67", "PASS", "Verified at factory"],
        ],
        col_widths=[35, 30, 45, 15, 65]
    )
    pdf.sub_section("17.2 MTBF Calculation")
    pdf.add_paragraph(
        f"The calculated Mean Time Between Failures (MTBF) for the {prod['sku']} is:"
    )
    pdf.add_table(
        ["Condition", "MTBF (hours)", "MTBF (years)", "Method"],
        [
            ["Ground Benign (GB)", "850,000", "97", "Telcordia SR-332"],
            ["Ground Fixed (GF)", "425,000", "48.5", "Telcordia SR-332"],
            ["Ground Mobile (GM)", "210,000", "24", "MIL-HDBK-217F"],
            ["Naval Sheltered (NS)", "180,000", "20.5", "MIL-HDBK-217F"],
        ]
    )


def build_applications(pdf, prod):
    """Page 26: Application Notes"""
    pdf.add_page()
    pdf.section_title("APPLICATION NOTES", "18")
    pdf.sub_section("18.1 Typical Installation Configurations")
    pdf.add_paragraph(
        f"The {prod['sku']} can be installed in various configurations depending on the application requirements. "
        f"The following examples illustrate common installation scenarios:"
    )
    pdf.add_paragraph(
        f"Configuration A: Direct Process Mount\n"
        f"The device is mounted directly on the process pipe or vessel using the integral process connection. "
        f"This configuration provides the fastest response time and is recommended for most applications."
    )
    pdf.add_paragraph(
        f"Configuration B: Remote Mount with Impulse Tubing\n"
        f"The device is mounted remotely from the process using impulse tubing. This configuration is used "
        f"when direct mounting is not practical due to high temperature, vibration, or accessibility constraints. "
        f"Keep impulse tubing as short as possible (< 3 m recommended) and slope continuously toward the process."
    )
    pdf.add_paragraph(
        f"Configuration C: Manifold Mount\n"
        f"The device is mounted on a valve manifold for isolation and calibration purposes. This is the "
        f"recommended configuration for critical process measurements and safety instrumented systems (SIS)."
    )
    pdf.sub_section("18.2 Best Practices")
    pdf.add_bullet_list([
        "Always install the device with the recommended orientation to minimize errors",
        "Use impulse tubing of the same material as the process piping",
        "Install drip legs or condensate pots for steam applications",
        "Use diaphragm seals for corrosive, viscous, or sanitary applications",
        "Consider using remote seals for high-temperature applications (> 120 C)",
        "Calibrate the device with the diaphragm seal attached (as a system)",
        "Document the installation configuration for future reference",
        "Include the device in the plant preventive maintenance program",
    ])
    pdf.sub_section("18.3 Industry-Specific Guidelines")
    pdf.add_table(
        ["Industry", "Key Considerations", "Recommended Options", "Relevant Standards"],
        [
            ["Oil & Gas", "Hazardous area, NACE", "ATEX, SIL, HC276", "API, ISA, NACE MR0175"],
            ["Chemical", "Corrosive media", "HC276/Titanium, PTFE seals", "DIN, EN, NAMUR"],
            ["Food & Beverage", "Hygiene, clean-in-place", "3-A, FDA, Ra < 0.8 um", "EHEDG, 3-A SSI"],
            ["Pharma", "Validation, traceability", "3.1 cert, NIST cal", "GAMP 5, 21 CFR Part 11"],
            ["Water/Wastewater", "Outdoor, submersible", "IP68, PUR cable", "MCERTS, NSF 61"],
            ["Power", "High temp, SIL", "HT version, SIL 2/3", "IEC 61511, ASME"],
        ],
        col_widths=[30, 40, 50, 70]
    )


def build_warranty(pdf, prod):
    """Page 27: Warranty"""
    pdf.add_page()
    pdf.section_title("WARRANTY & SUPPORT", "19")
    pdf.sub_section("19.1 Standard Warranty")
    pdf.add_paragraph(
        f"{prod['manufacturer']} warrants this product to be free from defects in materials and workmanship "
        f"for a period of three (3) years from the date of shipment from the factory. During the warranty period, "
        f"{prod['manufacturer']} will repair or replace, at its sole discretion, any product that is found to be "
        f"defective under normal use and service conditions."
    )
    pdf.sub_section("19.2 Warranty Exclusions")
    pdf.add_paragraph("This warranty does not cover damage resulting from:")
    pdf.add_bullet_list([
        "Misuse, abuse, neglect, or unauthorized modification of the product",
        "Installation or operation outside the specified ratings and conditions",
        "Damage caused by process media incompatibility with wetted materials",
        "Normal wear of consumable components (seals, gaskets, O-rings)",
        "Damage during shipping (claims must be filed with the carrier)",
        "Use of non-approved spare parts or accessories",
        "Failure to follow the installation and maintenance instructions in this document",
        "Acts of nature, including but not limited to lightning, flooding, or earthquake",
    ])
    pdf.sub_section("19.3 Technical Support")
    pdf.add_paragraph(
        f"For technical support, warranty claims, or spare parts orders, contact {prod['manufacturer']}:"
    )
    mfr_lower = prod['manufacturer'].lower().replace(' ', '')
    pdf.add_bullet_list([
        f"Email: support@{mfr_lower}.com",
        f"Phone: +49 (0) 123 456-789 (Europe) / +1-800-555-0199 (North America)",
        f"Web: www.{mfr_lower}.com/support",
        f"24/7 Emergency Hotline: +49 (0) 123 456-999",
    ])
    pdf.sub_section("19.4 Return Authorization")
    pdf.add_paragraph(
        "All products being returned for warranty repair or evaluation must have a Return Material Authorization (RMA) "
        "number issued by the factory. Contact the support team to obtain an RMA number before shipping any product. "
        "Products returned without an RMA number may be refused or delayed."
    )


def build_revision_history(pdf, prod):
    """Page 28: Revision History"""
    pdf.add_page()
    pdf.section_title("REVISION HISTORY", "20")
    pdf.add_table(
        ["Rev", "Date", "Author", "Description of Changes", "Approved"],
        [
            ["A", "2023-06-15", "Engineering", "Initial release", "QA Manager"],
            ["A1", "2023-09-20", "Engineering", "Added IO-Link communication option", "QA Manager"],
            ["A2", "2024-01-10", "Engineering", "Updated EMC test results per EN 61326-1:2021", "QA Manager"],
            ["A3", "2024-03-05", "Applications", "Added application notes for food & beverage", "QA Manager"],
            ["B", "2025-01-15", "Engineering", "Major revision: Added SIL certification, updated performance data, added new ordering options", "Director of Engineering"],
        ],
        col_widths=[12, 25, 28, 95, 30]
    )
    pdf.ln(10)
    pdf.sub_section("Document Information")
    pdf.add_spec_row("Document Number", prod["doc_number"])
    pdf.add_spec_row("Current Revision", "B")
    pdf.add_spec_row("Effective Date", "January 15, 2025")
    pdf.add_spec_row("Classification", "Public")
    pdf.add_spec_row("Language", "English")
    pdf.add_spec_row("Total Pages", "28")
    pdf.ln(5)
    pdf.add_paragraph(
        f"End of Document - {prod['product_name']} Technical Datasheet & Installation Manual"
    )
    pdf.add_paragraph(
        f"Copyright 2025 {prod['manufacturer']}. All rights reserved."
    )


# ---- Product definitions (abbreviated - reuse from original) ----

products = [
    {
        "product_name": "PS100 Industrial Pressure Transmitter",
        "sku": "PS100-420-SS", "manufacturer": "SensorTech Industries",
        "category": "Sensors", "etim": "EC001184", "doc_number": "DS-PS100-EN-RevB",
        "overview": "The PS100 is a high-accuracy piezoelectric pressure transmitter designed for demanding industrial process control applications. It features a flush-mount stainless steel diaphragm, 4-20 mA output with HART protocol compatibility, and SIL 2/3 certification for safety instrumented systems.",
        "specs": [("Measurement Range", "0 to 600 bar"), ("Output Signal", "4-20 mA (2-wire)"), ("Accuracy", "+/- 0.1% of full scale"), ("Response Time", "< 5 ms"), ("Overpressure Limit", "1.5x rated pressure"), ("Long-term Stability", "< 0.1% FS / year"), ("Turn-down Ratio", "100:1")],
        "electrical": [("Supply Voltage", "10 to 36 V DC"), ("Power Consumption", "< 0.8 W"), ("Loop Resistance", "0 to 1300 ohm"), ("Isolation Voltage", "500 V AC"), ("EMC Protection", "EN 61326-1")],
        "dimensions": [("Body Diameter", "27 mm"), ("Overall Length", "142 mm"), ("Process Connection", "G 1/2 male"), ("Electrical Connection", "M12x1 4-pin connector"), ("Weight", "240 g")],
        "operating": [("Operating Temperature", "-40 to 125 deg C"), ("Storage Temperature", "-50 to 150 deg C"), ("Humidity", "0 to 100% RH"), ("Vibration Resistance", "20 g (10 to 2000 Hz)"), ("IP Rating", "IP68")],
        "materials": [("Wetted Parts", "316L Stainless Steel"), ("Diaphragm", "Hastelloy C-276"), ("Seals", "FKM (Viton)"), ("Housing", "316 Stainless Steel"), ("Cable Gland", "Nickel-plated Brass")],
        "certifications": ["CE", "ATEX Zone 0", "IECEx", "SIL 2/3", "RoHS", "REACH"],
        "table_headers": ["Parameter", "Min", "Typical", "Max", "Unit"],
        "table_rows": [["Zero Offset", "-0.05", "0", "0.05", "% FS"], ["Span Error", "-0.1", "0", "0.1", "% FS"], ["Linearity", "-0.05", "---", "0.05", "% FS"], ["Hysteresis", "---", "0.02", "0.05", "% FS"], ["Temp. Effect Zero", "-0.02", "---", "0.02", "%FS/K"]],
    },
    {
        "product_name": "TS200 RTD Temperature Sensor Assembly",
        "sku": "TS200-PT100-3W", "manufacturer": "ThermoPoint GmbH",
        "category": "Sensors", "etim": "EC002988", "doc_number": "DS-TS200-EN-RevB",
        "overview": "The TS200 is a Class A Pt100 RTD temperature sensor assembly featuring a spring-loaded element for fast response and excellent vibration resistance. Designed for petrochemical and food-grade process applications with full ATEX and FDA compliance.",
        "specs": [("Sensor Type", "Pt100, 3-wire"), ("Accuracy Class", "Class A (IEC 60751)"), ("Measurement Range", "-200 to 600 deg C"), ("Response Time (t63)", "< 3 seconds in water"), ("Self-heating Error", "< 0.05 deg C"), ("Insulation Resistance", "> 100 MOhm at 500 V DC"), ("Drift", "< 0.05 deg C / 1000 hours")],
        "electrical": [("Excitation Current", "1 mA recommended"), ("Lead Resistance", "< 2 ohm per lead"), ("Connection Type", "3-wire RTD"), ("Cable Length", "2 m standard"), ("Shielding", "Braided copper shield")],
        "dimensions": [("Probe Diameter", "6 mm"), ("Insertion Length", "100 to 1000 mm"), ("Connection Head", "Form B (DIN 43729)"), ("Process Connection", "G 1/2 A (DIN 16288)"), ("Weight", "350 g")],
        "operating": [("Ambient Temperature", "-40 to 85 deg C"), ("Process Temperature", "-200 to 600 deg C"), ("Max Pressure", "100 bar at 20 deg C"), ("Vibration", "10 g (10-500 Hz)"), ("IP Rating", "IP68")],
        "materials": [("Thermowell", "316L Stainless Steel"), ("Element Housing", "Inconel 600"), ("Seals", "Graphite"), ("Connection Head", "Aluminum alloy, epoxy coated"), ("Insulation", "MgO (Magnesium Oxide)")],
        "certifications": ["CE", "ATEX II 1G", "IECEx", "FDA 21 CFR", "RoHS"],
        "table_headers": ["Range (deg C)", "Tolerance Class A", "Tolerance Class B", "Response t63"],
        "table_rows": [["-200 to -100", "+/- 0.35 C", "+/- 0.70 C", "< 5 s"], ["-100 to 0", "+/- 0.25 C", "+/- 0.50 C", "< 4 s"], ["0 to 200", "+/- 0.15+0.002*T", "+/- 0.30+0.005*T", "< 3 s"], ["200 to 600", "+/- 0.15+0.002*T", "+/- 0.30+0.005*T", "< 3 s"]],
    },
    {
        "product_name": "SM400 Brushless AC Servo Motor",
        "sku": "SM400-3K5-B", "manufacturer": "DriveForce Automation",
        "category": "Motors", "etim": "EC001851", "doc_number": "DS-SM400-EN-RevB",
        "overview": "The SM400 is a high-performance brushless AC servo motor with integrated absolute encoder. Designed for precision motion control in CNC machines, robotics, and packaging equipment. Features rare-earth NdFeB magnets and ultra-low cogging torque design for smooth motion at all speeds.",
        "specs": [("Rated Power", "3.5 kW"), ("Rated Torque", "11.2 Nm"), ("Peak Torque", "33.6 Nm"), ("Rated Speed", "3000 RPM"), ("Max Speed", "5000 RPM"), ("Torque Constant", "1.42 Nm/A"), ("Rotor Inertia", "7.5 x 10^-4 kg.m2")],
        "electrical": [("Rated Voltage", "400 V AC, 3-phase"), ("Rated Current", "8.5 A"), ("Peak Current", "25.5 A"), ("Back-EMF Constant", "175 V/kRPM"), ("Winding Resistance", "1.2 ohm (phase-phase)")],
        "dimensions": [("Frame Size", "130 mm"), ("Body Length", "185 mm"), ("Shaft Diameter", "22 mm"), ("Shaft Length", "50 mm"), ("Weight", "12.4 kg")],
        "operating": [("Ambient Temperature", "0 to 40 deg C"), ("Insulation Class", "Class F (155 deg C)"), ("Cooling", "Natural convection"), ("Vibration", "< 5 mm/s (IEC 60034-14)"), ("IP Rating", "IP65")],
        "materials": [("Stator Core", "Silicon Steel Laminations"), ("Magnets", "NdFeB (N42SH)"), ("Shaft", "42CrMo4 alloy steel"), ("Housing", "Aluminum alloy (die-cast)"), ("Windings", "Class H copper wire")],
        "certifications": ["CE", "UL", "CSA", "CCC", "RoHS", "REACH"],
        "table_headers": ["Model", "Power (kW)", "Torque (Nm)", "Speed (RPM)", "Weight (kg)"],
        "table_rows": [["SM400-1K0", "1.0", "3.2", "3000", "5.2"], ["SM400-2K0", "2.0", "6.4", "3000", "8.1"], ["SM400-3K5", "3.5", "11.2", "3000", "12.4"], ["SM400-5K0", "5.0", "16.0", "3000", "16.8"], ["SM400-7K5", "7.5", "24.0", "3000", "22.0"]],
    },
    {
        "product_name": "CV200 Globe Control Valve",
        "sku": "CV200-DN80-PN40", "manufacturer": "ValveTech International",
        "category": "Valves", "etim": "EC002450", "doc_number": "DS-CV200-EN-RevB",
        "overview": "The CV200 is a pneumatically actuated globe control valve for precision throttling of steam, water, and chemical process fluids. Features equal percentage or linear flow characteristics, integral digital positioner with HART communication, and SIL 3 certification for safety-critical shutoff applications.",
        "specs": [("Valve Type", "Single-seat Globe"), ("Nominal Size", "DN80 (3 inch)"), ("Pressure Rating", "PN 40 / ANSI 300"), ("Cv (Flow Coefficient)", "120"), ("Rangeability", "50:1"), ("Leakage Class", "ANSI/FCI 70-2 Class IV"), ("Flow Characteristic", "Equal Percentage")],
        "electrical": [("Positioner Input", "4-20 mA"), ("Positioner Feedback", "4-20 mA"), ("Supply Air", "1.4 to 7 bar"), ("Communication", "HART / Foundation Fieldbus"), ("Solenoid Valve", "24 V DC, ATEX approved")],
        "dimensions": [("Face-to-Face", "310 mm (EN 558-1)"), ("Flange Type", "EN 1092-1, Form B1"), ("Overall Height", "580 mm (with actuator)"), ("Actuator Size", "Size 60 diaphragm"), ("Weight", "85 kg (complete assembly)")],
        "operating": [("Temperature Range", "-29 to 425 deg C"), ("Max Differential Pressure", "25 bar"), ("Ambient Temperature", "-20 to 60 deg C"), ("Shutoff Pressure", "40 bar"), ("Cycle Life", "> 1,000,000 cycles")],
        "materials": [("Body", "WCB Carbon Steel (A216)"), ("Trim", "316 Stainless Steel"), ("Seat Ring", "Stellite 6 overlay"), ("Packing", "PTFE V-ring"), ("Gasket", "Spiral Wound SS/Graphite")],
        "certifications": ["CE", "ATEX", "SIL 2/3", "RoHS", "REACH"],
        "table_headers": ["Travel %", "Cv", "Flow %", "Gain"],
        "table_rows": [["10%", "2.4", "2%", "0.20"], ["25%", "9.5", "8%", "0.32"], ["50%", "38", "32%", "0.63"], ["75%", "76", "63%", "1.00"], ["100%", "120", "100%", "1.58"]],
    },
    {
        "product_name": "CP300 Horizontal Centrifugal Process Pump",
        "sku": "CP300-65-40-200", "manufacturer": "HydroFlow Engineering",
        "category": "Pumps", "etim": "EC002620", "doc_number": "DS-CP300-EN-RevB",
        "overview": "The CP300 is an ISO 5199 / ISO 2858 compliant end-suction centrifugal pump for chemical processing, water treatment, and HVAC applications. Back pull-out design for easy maintenance without disturbing piping. Features SiC/SiC mechanical seal and optional API 682 seal plan.",
        "specs": [("Pump Type", "End-suction, single stage"), ("Flow Rate", "65 m3/h (at BEP)"), ("Total Head", "40 m"), ("Impeller Diameter", "200 mm"), ("Efficiency", "78% at BEP"), ("NPSH Required", "2.5 m"), ("Specific Speed", "32 (metric)")],
        "electrical": [("Motor Power", "15 kW"), ("Motor Speed", "2960 RPM (2-pole, 50 Hz)"), ("Motor Voltage", "400 V AC, 3-phase"), ("Motor Efficiency", "IE3 (93.0%)"), ("Starting Method", "DOL / Star-Delta / VFD")],
        "dimensions": [("Suction", "DN80 (PN16 flange)"), ("Discharge", "DN65 (PN16 flange)"), ("Baseplate Length", "1200 mm"), ("Overall Height", "450 mm"), ("Weight (dry)", "180 kg (pump + motor)")],
        "operating": [("Fluid Temperature", "-30 to 140 deg C"), ("Max Working Pressure", "16 bar"), ("Ambient Temperature", "-20 to 45 deg C"), ("Min Flow", "25% of BEP"), ("Max Solids", "< 5% by weight")],
        "materials": [("Casing", "GGG-40.3 Ductile Iron"), ("Impeller", "316L Stainless Steel"), ("Shaft", "AISI 4140 alloy steel"), ("Wear Rings", "Duplex SS 2205"), ("Mechanical Seal", "SiC/SiC/FKM (EN 12756)")],
        "certifications": ["CE", "ATEX Zone 2", "ISO 5199", "ISO 2858", "API 610", "RoHS"],
        "table_headers": ["Flow (m3/h)", "Head (m)", "Power (kW)", "NPSH-r (m)", "Eff. (%)"],
        "table_rows": [["20", "48", "6.5", "1.5", "55"], ["40", "45", "10.2", "2.0", "72"], ["65", "40", "14.5", "2.5", "78"], ["80", "35", "15.0", "3.2", "74"], ["100", "26", "14.8", "4.5", "65"]],
    },
    {
        "product_name": "CB400 Molded Case Circuit Breaker",
        "sku": "CB400-3P-250A", "manufacturer": "ElectroPower Systems",
        "category": "Electrical", "etim": "EC000082", "doc_number": "DS-CB400-EN-RevB",
        "overview": "The CB400 is an IEC 60947-2 compliant MCCB for protection of electrical circuits against overload and short-circuit currents. Features thermal-magnetic trip unit with adjustable Ir and fixed Im settings, front-accessible wiring, and optional motorized operator for remote switching.",
        "specs": [("Frame Size", "400 A"), ("Rated Current (In)", "250 A (adjustable 200-250 A)"), ("Poles", "3-pole"), ("Breaking Capacity (Icu)", "50 kA at 415 V AC"), ("Service Breaking (Ics)", "100% Icu"), ("Trip Unit", "Thermal-Magnetic, adjustable"), ("Utilization Category", "A (non-selective)")],
        "electrical": [("Rated Voltage (Ue)", "690 V AC"), ("Insulation Voltage (Ui)", "800 V"), ("Impulse Voltage (Uimp)", "8 kV"), ("Frequency", "50/60 Hz"), ("Auxiliary Contacts", "1 NO + 1 NC (standard)")],
        "dimensions": [("Width", "140 mm (3P)"), ("Height", "260 mm"), ("Depth", "103 mm"), ("Mounting", "DIN rail / direct"), ("Weight", "3.8 kg")],
        "operating": [("Ambient Temperature", "-25 to 70 deg C"), ("Storage Temperature", "-40 to 85 deg C"), ("Altitude", "Up to 2000 m"), ("Mechanical Life", "20,000 operations"), ("Electrical Life", "10,000 operations")],
        "materials": [("Housing", "Glass-reinforced Polyamide PA6.6"), ("Contacts", "Silver alloy"), ("Arc Chamber", "Ceramic plates"), ("Terminals", "Tinned copper"), ("Operating Mechanism", "Toggle, stored energy")],
        "certifications": ["IEC 60947-2", "CE", "UL 489", "CSA", "CCC", "RoHS"],
        "table_headers": ["Voltage", "Icu (kA)", "Ics (kA)", "Icw (1s)"],
        "table_rows": [["230 V AC", "65", "65", "---"], ["415 V AC", "50", "50", "---"], ["500 V AC", "36", "36", "---"], ["690 V AC", "20", "20", "---"]],
    },
    {
        "product_name": "PLC200 Compact Programmable Logic Controller",
        "sku": "PLC200-16DI-12DO", "manufacturer": "AutoLogic Technologies",
        "category": "Controllers", "etim": "EC001185", "doc_number": "DS-PLC200-EN-RevB",
        "overview": "The PLC200 is a compact PLC for small to medium automation applications including packaging machines, material handling, and building automation. Features integrated I/O, dual Ethernet/IP ports, web-based programming IDE, and MQTT support for Industry 4.0 connectivity.",
        "specs": [("CPU", "ARM Cortex-A9, 800 MHz"), ("Program Memory", "4 MB"), ("Data Memory", "2 MB"), ("Digital Inputs", "16 x 24 V DC (sink/source)"), ("Digital Outputs", "12 x relay (2 A)"), ("Analog Inputs", "4 x 0-10 V / 4-20 mA"), ("Scan Time", "< 1 ms per 1000 instructions")],
        "electrical": [("Supply Voltage", "24 V DC (18-32 V DC)"), ("Power Consumption", "12 W max"), ("Communication", "2x Ethernet/IP, 1x RS-485"), ("Protocols", "Modbus TCP/RTU, EtherNet/IP, MQTT"), ("USB", "Mini-USB for programming")],
        "dimensions": [("Width", "110 mm (6 modules)"), ("Height", "100 mm"), ("Depth", "75 mm"), ("Mounting", "35 mm DIN rail"), ("Weight", "320 g")],
        "operating": [("Operating Temperature", "-20 to 60 deg C"), ("Storage Temperature", "-40 to 85 deg C"), ("Humidity", "5 to 95% RH"), ("Vibration", "IEC 60068-2-6"), ("IP Rating", "IP20")],
        "materials": [("Housing", "PC/ABS blend, UL94 V-0"), ("Connectors", "Pluggable spring terminals"), ("PCB", "Multi-layer FR4"), ("LED Indicators", "Per-channel status LEDs"), ("RTC Battery", "CR2032 lithium (replaceable)")],
        "certifications": ["IEC 61131-2", "CE", "UL 508", "CSA", "RoHS"],
        "table_headers": ["I/O Type", "Channels", "Voltage", "Response Time"],
        "table_rows": [["DI", "16", "24 V DC", "< 1 ms"], ["DO (relay)", "12", "250V AC / 30V DC", "8 ms"], ["AI (voltage)", "4", "0-10 V", "1 ms / ch"], ["AI (current)", "4", "4-20 mA", "1 ms / ch"]],
    },
    {
        "product_name": "HC16 Heavy-Duty Industrial Connector",
        "sku": "HC16-24P-M25", "manufacturer": "ConnectPro Industries",
        "category": "Connectors", "etim": "EC001024", "doc_number": "DS-HC16-EN-RevB",
        "overview": "The HC16 is a modular heavy-duty rectangular connector system for machine-to-cabinet connections. Combines power, signal, and data contacts in a single housing with quick-lock mechanism. EN 61984 compliant with IP65 protection when mated.",
        "specs": [("Contact Configuration", "24 poles (16A)"), ("Rated Current", "16 A per contact"), ("Rated Voltage", "500 V AC / 600 V DC"), ("Insulation Resistance", "> 10^9 ohm"), ("Dielectric Strength", "3000 V AC / 1 min"), ("Mating Cycles", "> 500"), ("Wire Range", "0.5 to 2.5 mm2")],
        "electrical": [("Contact Resistance", "< 2 mohm"), ("Max Frequency", "Up to 10 MHz"), ("Creepage Distance", "> 8 mm"), ("Clearance", "> 6 mm"), ("Grounding", "PE contact, first-make/last-break")],
        "dimensions": [("Housing Size", "10B (single lever)"), ("Insert Size", "Han 24B"), ("Cable Entry", "M25"), ("Hood Dimensions", "104 x 54 mm"), ("Weight", "450 g (complete set)")],
        "operating": [("Temperature Range", "-40 to 125 deg C"), ("IP Rating", "IP65 (mated)"), ("Humidity", "100% RH"), ("Salt Spray", "500 hours"), ("Vibration", "IEC 60068-2-6 (10g)")],
        "materials": [("Housing", "Die-cast Aluminum, powder coated"), ("Inserts", "PC + GF, UL94 V-0"), ("Contacts", "CuSn with Ag plating"), ("Gasket", "Silicone"), ("Locking", "Single lever, SS spring")],
        "certifications": ["IEC 61984", "CE", "UL", "CSA", "RoHS"],
        "table_headers": ["Pin Count", "Current (A)", "Housing Size", "Cable Entry"],
        "table_rows": [["6 poles", "16 A", "6B", "M20"], ["16 poles", "16 A", "16B", "M25"], ["24 poles", "16 A", "24B", "M25"], ["6+12+PE", "40A+16A", "16B", "M32"]],
    },
    {
        "product_name": "PSW40 Electronic Pressure Switch",
        "sku": "PSW40-400B-G14", "manufacturer": "PresSafe Technologies",
        "category": "Switches", "etim": "EC001312", "doc_number": "DS-PSW40-EN-RevB",
        "overview": "The PSW40 is a programmable electronic pressure switch with analog output and IO-Link for hydraulic and pneumatic systems. Features OLED display with 360-degree readability, 2 independently programmable switch outputs, teach-in function, and real-time diagnostics via IO-Link V1.1.",
        "specs": [("Pressure Range", "0 to 400 bar"), ("Switching Output", "2x PNP/NPN (programmable)"), ("Analog Output", "4-20 mA (scalable)"), ("Accuracy", "+/- 0.5% FS (BFSL)"), ("Burst Pressure", "1200 bar"), ("Communication", "IO-Link V1.1"), ("Response Time", "< 2 ms")],
        "electrical": [("Supply Voltage", "15 to 36 V DC"), ("Current Consumption", "< 100 mA"), ("Switch Output Current", "250 mA max"), ("Short-circuit Protection", "Yes (auto-recovery)"), ("Connector", "M12 x 1, 5-pin")],
        "dimensions": [("Process Connection", "G 1/4 male"), ("Body Diameter", "30 mm"), ("Length", "76 mm"), ("Display", "OLED, 128x64 pixel"), ("Weight", "85 g")],
        "operating": [("Medium Temperature", "-25 to 85 deg C"), ("Ambient Temperature", "-25 to 70 deg C"), ("IP Rating", "IP65 / IP67"), ("EMC", "EN 61326-1"), ("Shock / Vibration", "100g / 20g")],
        "materials": [("Body", "316L Stainless Steel"), ("Diaphragm", "316L Stainless Steel"), ("Process Seal", "FKM (Viton)"), ("Display Window", "PMMA"), ("Connector", "PA66, nickel-plated brass")],
        "certifications": ["CE", "UL", "CSA", "RoHS", "REACH"],
        "table_headers": ["Range (bar)", "Accuracy", "Burst (bar)", "Process Connection"],
        "table_rows": [["-1 to 10", "+/- 0.5%", "30", "G 1/4"], ["0 to 25", "+/- 0.5%", "75", "G 1/4"], ["0 to 100", "+/- 0.5%", "300", "G 1/4"], ["0 to 400", "+/- 0.5%", "1200", "G 1/4"]],
    },
]


def generate_full_datasheet(prod):
    """Generate a complete 20-28 page PDF datasheet."""
    pdf = DatasheetPDF(prod["product_name"], prod["manufacturer"], prod["sku"], prod["doc_number"])
    pdf.alias_nb_pages()

    build_cover_page(pdf, prod)       # Page 1
    build_toc(pdf)                    # Page 2
    build_overview(pdf, prod)         # Pages 3-4
    build_specs(pdf, prod)            # Pages 5-6
    build_electrical(pdf, prod)       # Pages 7-8
    build_dimensions(pdf, prod)       # Pages 9-10
    build_operating(pdf, prod)        # Pages 10-11
    build_materials(pdf, prod)        # Pages 11-12
    build_performance(pdf, prod)      # Pages 13-14
    build_installation(pdf, prod)     # Pages 15-16
    build_commissioning(pdf, prod)    # Pages 17-18
    build_wiring(pdf, prod)           # Page 19
    build_configuration(pdf, prod)    # Page 20
    build_maintenance(pdf, prod)      # Pages 21-22
    build_safety(pdf, prod)           # Page 23
    build_ordering(pdf, prod)         # Pages 24-25
    build_certifications(pdf, prod)   # Page 26
    build_quality(pdf, prod)          # Page 27
    build_environmental(pdf, prod)    # Page 28
    build_applications(pdf, prod)     # Page 29
    build_warranty(pdf, prod)         # Page 30
    build_revision_history(pdf, prod) # Page 31

    filepath = os.path.join(OUTPUT_DIR, prod["sku"].replace("-", "_") + "_Datasheet.pdf")
    pdf.output(filepath)
    return filepath, pdf.page_no()


if __name__ == "__main__":
    print(f"\nGenerating {len(products)} comprehensive industrial datasheets (20-30 pages each)...\n")
    total_pages = 0
    for prod in products:
        filepath, pages = generate_full_datasheet(prod)
        total_pages += pages
        print(f"  [+] {os.path.basename(filepath):<50} {pages} pages  ({prod['category']})")

    print(f"\n{'='*65}")
    print(f"  Generated {len(products)} datasheets | {total_pages} total pages")
    print(f"  Output: {os.path.abspath(OUTPUT_DIR)}/")
    print(f"{'='*65}\n")
