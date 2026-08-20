export const MOCK_PRODUCTS = [
  {
    id: "prod-101",
    sku: "SF-TURB-9020-X",
    name: "Apex Series Heavy Industrial Gas Turbine 9000X",
    category: "Power Generation / Turbines",
    status: "Verified",
    confidence: 96.8,
    dateAdded: "2026-08-17 14:22",
    documentName: "Apex9000X_Technical_Spec_v4.2.pdf",
    fileSize: "14.2 MB",
    pagesCount: 28,
    reviewNeeded: false,
    extractedFields: [
      { id: "f1", name: "Operating Pressure", value: "32.4 Bar", confidence: 99.2, verified: true, boundingBox: { page: 1, x: 120, y: 180, width: 210, height: 35 } },
      { id: "f2", name: "Max Heat Output", value: "450 MW", confidence: 98.5, verified: true, boundingBox: { page: 1, x: 120, y: 225, width: 190, height: 35 } },
      { id: "f3", name: "ISO Rating Speed", value: "3,600 RPM", confidence: 97.4, verified: true, boundingBox: { page: 2, x: 140, y: 100, width: 220, height: 35 } },
      { id: "f4", name: "Turbine Blade Alloy", value: "Inconel 738LC (Single Crystal)", confidence: 94.1, verified: true, boundingBox: { page: 3, x: 80, y: 310, width: 340, height: 38 } },
      { id: "f5", name: "Exhaust Temperature", value: "625 °C (±5°C)", confidence: 95.0, verified: true, boundingBox: { page: 3, x: 80, y: 360, width: 250, height: 35 } },
      { id: "f6", name: "Emmision Class", value: "Dry Low NOx 2.6+", confidence: 93.7, verified: true, boundingBox: { page: 4, x: 150, y: 410, width: 280, height: 35 } }
    ],
    relationships: [
      { targetId: "prod-102", type: "Shared Component", label: "Shares Dual Ignition System" },
      { targetId: "prod-105", type: "Successor Of", label: "Upgraded from Apex 8500X" }
    ]
  },
  {
    id: "prod-102",
    sku: "SF-PUMP-4050-H",
    name: "HydroFlow High-Pressure Centrifugal Slurry Pump",
    category: "Fluid Dynamics / Industrial Pumps",
    status: "Review Needed",
    confidence: 78.4,
    dateAdded: "2026-08-18 09:15",
    documentName: "HydroFlow_PUMP_Datasheet_RevB.pdf",
    fileSize: "8.7 MB",
    pagesCount: 14,
    reviewNeeded: true,
    extractedFields: [
      { id: "f21", name: "Flow Rate Capacity", value: "1,250 m³/h", confidence: 95.1, verified: true, boundingBox: { page: 1, x: 110, y: 150, width: 220, height: 35 } },
      { id: "f22", name: "Impeller Material", value: "High-Chrome Alloy 27%", confidence: 76.2, verified: false, reviewNotes: "OCR confidence low on alloy code ('27%' vs '28%')", boundingBox: { page: 1, x: 110, y: 200, width: 290, height: 38 } },
      { id: "f23", name: "Motor Power Rating", value: "315 kW @ 1480 RPM", confidence: 92.0, verified: true, boundingBox: { page: 2, x: 90, y: 120, width: 260, height: 35 } },
      { id: "f24", name: "Suction Flange Diameter", value: "DN 250 (10 Inch PN16)", confidence: 71.5, verified: false, reviewNotes: "Possible discrepancy between ISO metric and ANSI standard", boundingBox: { page: 2, x: 90, y: 170, width: 310, height: 38 } },
      { id: "f25", name: "Seal Type", value: "Heavy-Duty Cartridge Mechanical Seal", confidence: 94.8, verified: true, boundingBox: { page: 3, x: 100, y: 280, width: 350, height: 35 } }
    ],
    relationships: [
      { targetId: "prod-101", type: "Shared Component", label: "Shares Auxiliary Cooling Rig" },
      { targetId: "prod-104", type: "Sub-assembly", label: "Interfaces with Sensor Node S4" }
    ]
  },
  {
    id: "prod-103",
    sku: "SF-MCU-3200-ST",
    name: "Stellaris ARM Cortex-M7 Industrial Microcontroller",
    category: "Embedded Systems / Semiconductors",
    status: "Verified",
    confidence: 99.1,
    dateAdded: "2026-08-18 08:30",
    documentName: "MCU3200_DataSheet_Final.pdf",
    fileSize: "5.4 MB",
    pagesCount: 64,
    reviewNeeded: false,
    extractedFields: [
      { id: "f31", name: "Core Frequency", value: "480 MHz", confidence: 99.8, verified: true, boundingBox: { page: 1, x: 130, y: 140, width: 180, height: 35 } },
      { id: "f32", name: "Flash Memory", value: "2 MB Dual-Bank", confidence: 99.5, verified: true, boundingBox: { page: 1, x: 130, y: 185, width: 220, height: 35 } },
      { id: "f33", name: "SRAM Capacity", value: "1 MB (512KB TCM)", confidence: 99.2, verified: true, boundingBox: { page: 1, x: 130, y: 230, width: 240, height: 35 } },
      { id: "f34", name: "Operating Temp Range", value: "-40°C to +125°C", confidence: 98.9, verified: true, boundingBox: { page: 2, x: 100, y: 300, width: 260, height: 35 } }
    ],
    relationships: [
      { targetId: "prod-104", type: "Sub-assembly", label: "Drives Core Processing Unit" }
    ]
  },
  {
    id: "prod-104",
    sku: "SF-SENS-8800-V",
    name: "VibraSense Triaxial Vibration & Temp Sensor Probe",
    category: "Sensors & Diagnostics / IoT",
    status: "Verified",
    confidence: 94.6,
    dateAdded: "2026-08-16 11:45",
    documentName: "VibraSense_Spec_Sheet_2026.pdf",
    fileSize: "3.1 MB",
    pagesCount: 8,
    reviewNeeded: false,
    extractedFields: [
      { id: "f41", name: "Frequency Response", value: "0.5 Hz to 12,000 Hz", confidence: 97.2, verified: true, boundingBox: { page: 1, x: 100, y: 160, width: 280, height: 35 } },
      { id: "f42", name: "Communication Protocol", value: "IO-Link v1.1 & Modbus TCP", confidence: 96.0, verified: true, boundingBox: { page: 1, x: 100, y: 210, width: 310, height: 35 } },
      { id: "f43", name: "IP Rating", value: "IP69K Waterproof Submersible", confidence: 98.1, verified: true, boundingBox: { page: 2, x: 120, y: 140, width: 300, height: 35 } }
    ],
    relationships: [
      { targetId: "prod-102", type: "Sub-assembly", label: "Monitors Vibration on Pump Bearings" },
      { targetId: "prod-103", type: "Sub-assembly", label: "Connected via SPI Bus" }
    ]
  },
  {
    id: "prod-105",
    sku: "SF-BRK-6000-E",
    name: "OptiSwitch 6000A Digital Vacuum Circuit Breaker",
    category: "Electrical Grid / Switchgear",
    status: "Review Needed",
    confidence: 81.3,
    dateAdded: "2026-08-17 18:05",
    documentName: "OptiSwitch6000A_Manual.pdf",
    fileSize: "18.5 MB",
    pagesCount: 42,
    reviewNeeded: true,
    extractedFields: [
      { id: "f51", name: "Rated Voltage", value: "17.5 kV", confidence: 94.0, verified: true, boundingBox: { page: 1, x: 140, y: 180, width: 170, height: 35 } },
      { id: "f52", name: "Short-Circuit Breaking", value: "50 kA (3 sec)", confidence: 82.5, verified: false, reviewNotes: "Discrepancy with standard 40kA rating table", boundingBox: { page: 1, x: 140, y: 230, width: 280, height: 38 } },
      { id: "f53", name: "Mechanical Endurance", value: "30,000 Operations (Class M2)", confidence: 88.0, verified: true, boundingBox: { page: 2, x: 110, y: 190, width: 340, height: 35 } }
    ],
    relationships: [
      { targetId: "prod-101", type: "Shared Component", label: "Protects Generator Feeders" }
    ]
  }
];

export const AGENT_PIPELINE_STEPS = [
  {
    id: "doc-agent",
    name: "Document Agent",
    role: "OCR Layout Analysis & Parsing",
    icon: "FileSearch",
    duration: "1.8s",
    description: "Parses PDF structure, performs high-density OCR layout analysis, separates schematics from tables.",
    output: "Clean document DOM, table matrices, vector coordinate mapping."
  },
  {
    id: "extract-agent",
    name: "Extraction Agent",
    role: "LLM Technical Property Mining",
    icon: "Cpu",
    duration: "2.4s",
    description: "Mines domain-specific technical properties, parameters, units of measure, and tolerances.",
    output: "24 raw candidate key-value pairs with contextual bounding boxes."
  },
  {
    id: "enrich-agent",
    name: "Enrichment Agent",
    role: "Cross-Reference & Specification Augmentation",
    icon: "Zap",
    duration: "2.1s",
    description: "Augments missing international standard codes (ISO, DIN, ANSI, IEEE) from enterprise catalog.",
    output: "Standardized unit conversions & material grade mapping."
  },
  {
    id: "norm-agent",
    name: "Normalization Agent",
    role: "Schema & Unit Standardizer",
    icon: "Sliders",
    duration: "1.5s",
    description: "Converts non-standard terms into enterprise canonical data schemas.",
    output: "Canonical JSON schema matching industrial spec standards."
  },
  {
    id: "tax-agent",
    name: "Taxonomy Mapping Agent",
    role: "Graph & Catalog Classification",
    icon: "Network",
    duration: "1.9s",
    description: "Maps product attributes to global UNSPSC taxonomy hierarchy and links existing graph entities.",
    output: "Taxonomy Code: UNSPSC 26101602 (Gas Turbines), Knowledge Graph Edges."
  },
  {
    id: "val-agent",
    name: "Validation Agent",
    role: "Confidence Scoring & Boundary Checks",
    icon: "CheckCircle2",
    duration: "1.2s",
    description: "Evaluates physical constraint checks, range validations, and assigns field-level confidence scores.",
    output: "Overall Record Confidence Score: 96.8% (Approved for Automated Record Generation)."
  }
];

export const MOCK_STATS = [
  {
    id: "stat-products",
    title: "Total Verified Products",
    value: "1,428",
    unit: "Records",
    percentage: 94,
    color: "#6366F1",
    sparkline: [120, 145, 160, 210, 290, 380, 428],
    breakdown: [
      { label: "Turbines & Motors", value: "38%", count: 542 },
      { label: "Pumps & Hydraulics", value: "27%", count: 385 },
      { label: "Sensors & Controllers", value: "22%", count: 314 },
      { label: "Switchgear & Grid", value: "13%", count: 187 }
    ]
  },
  {
    id: "stat-fields",
    title: "Extracted Attributes",
    value: "48.6K",
    unit: "Fields",
    percentage: 98,
    color: "#8B5CF6",
    sparkline: [32, 36, 40, 42, 45, 47, 48.6],
    breakdown: [
      { label: "Physical Specs", value: "42%", count: 20412 },
      { label: "Electrical Ratings", value: "28%", count: 13608 },
      { label: "Material Grades", value: "18%", count: 8748 },
      { label: "Certifications", value: "12%", count: 5832 }
    ]
  },
  {
    id: "stat-verified",
    title: "Automated Accuracy",
    value: "96.4%",
    unit: "Verified Rate",
    percentage: 96.4,
    color: "#10B981",
    sparkline: [91.2, 92.5, 93.8, 94.5, 95.2, 96.0, 96.4],
    breakdown: [
      { label: "Auto-Approved", value: "88%", count: 1256 },
      { label: "Verified post-review", value: "8.4%", count: 120 },
      { label: "Rejected / Escalated", value: "3.6%", count: 52 }
    ]
  },
  {
    id: "stat-review",
    title: "Pending Human Review",
    value: "18",
    unit: "Products",
    percentage: 18,
    color: "#F59E0B",
    sparkline: [42, 38, 30, 25, 22, 19, 18],
    breakdown: [
      { label: "OCR Ambiguity", value: "50%", count: 9 },
      { label: "Unit Mismatch", value: "33%", count: 6 },
      { label: "New Taxonomy Candidate", value: "17%", count: 3 }
    ]
  }
];

export const MOCK_GRAPH_NODES = [
  { id: "prod-101", label: "Apex 9000X Turbine", category: "Turbine", confidence: 96.8, color: "#8B5CF6", val: 28 },
  { id: "prod-102", label: "HydroFlow Pump", category: "Pump", confidence: 78.4, color: "#F59E0B", val: 22 },
  { id: "prod-103", label: "Stellaris Cortex-M7", category: "Microcontroller", confidence: 99.1, color: "#10B981", val: 24 },
  { id: "prod-104", label: "VibraSense Sensor", category: "Sensor", confidence: 94.6, color: "#6366F1", val: 20 },
  { id: "prod-105", label: "OptiSwitch 6000A", category: "Breaker", confidence: 81.3, color: "#EC4899", val: 25 },
  { id: "node-6", label: "Combustion Chamber C4", category: "Sub-component", confidence: 95.0, color: "#3B82F6", val: 16 },
  { id: "node-7", label: "Auxiliary Heat Exchanger", category: "Sub-component", confidence: 93.2, color: "#06B6D4", val: 18 },
  { id: "node-8", label: "DIN EN 10204-3.1 Cert", category: "Standard", confidence: 99.9, color: "#10B981", val: 14 }
];

export const MOCK_GRAPH_LINKS = [
  { source: "prod-101", target: "node-6", label: "Has Sub-assembly" },
  { source: "prod-101", target: "node-7", label: "Thermal Line Connection" },
  { source: "prod-101", target: "prod-102", label: "Shares Dual Ignition System" },
  { source: "prod-102", target: "prod-104", label: "Monitored By Sensor Node" },
  { source: "prod-103", target: "prod-104", label: "SPI Control Interface" },
  { source: "prod-105", target: "prod-101", label: "Protects Generator Feeders" },
  { source: "node-6", target: "node-8", label: "Certified Compliance" }
];

export const MOCK_ANALYTICS_VOLUME = [
  { month: "Jan", volume: 240, verified: 225, review: 15 },
  { month: "Feb", volume: 380, verified: 360, review: 20 },
  { month: "Mar", volume: 450, verified: 425, review: 25 },
  { month: "Apr", volume: 620, verified: 590, review: 30 },
  { month: "May", volume: 780, verified: 750, review: 30 },
  { month: "Jun", volume: 920, verified: 885, review: 35 },
  { month: "Jul", volume: 1150, verified: 1110, review: 40 },
  { month: "Aug", volume: 1428, verified: 1376, review: 52 }
];

export const MOCK_AGENT_PERFORMANCE = [
  { name: "Document Agent", latencyMs: 320, accuracy: 99.4 },
  { name: "Extraction Agent", latencyMs: 840, accuracy: 96.8 },
  { name: "Enrichment Agent", latencyMs: 510, accuracy: 97.5 },
  { name: "Normalization Agent", latencyMs: 290, accuracy: 98.9 },
  { name: "Taxonomy Mapping", latencyMs: 460, accuracy: 95.2 },
  { name: "Validation Agent", latencyMs: 180, accuracy: 99.1 }
];
