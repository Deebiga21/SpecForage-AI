# SpecForage AI Sample Test Datasets

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
