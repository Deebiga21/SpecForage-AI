import pint
from typing import List
from schemas import Specification, ValidationItem

# Initialize a unit registry globally so it's only created once
ureg = pint.UnitRegistry()

def validate_specifications(specs: List[Specification]) -> List[ValidationItem]:
    """
    Validates extracted specifications using pint.
    Checks if units are valid physical units and values are parseable.
    """
    results = []
    
    for spec in specs:
        if not spec.value:
            results.append(ValidationItem(check=spec.name, status="Failed (missing value)"))
            continue
            
        # If there's no unit, we just check if it's numeric or fallback
        if not spec.unit:
            try:
                val = float(spec.value)
                results.append(ValidationItem(check=spec.name, status="OK (no unit, numeric)"))
            except ValueError:
                results.append(ValidationItem(check=spec.name, status="OK (non-numeric text)"))
            continue
        
        # We have a unit, check it
        try:
            # Check unit validity
            if spec.unit not in ureg:
                results.append(ValidationItem(check=spec.name, status=f"Failed (unknown unit: {spec.unit})"))
                continue
                
            # Check value validity
            try:
                val = float(spec.value)
                # We could add range checks for specific properties (e.g. negative voltage)
                if val < 0 and "voltage" in spec.name.lower():
                    results.append(ValidationItem(check=spec.name, status="Failed (negative voltage)"))
                else:
                    results.append(ValidationItem(check=spec.name, status="OK"))
            except ValueError:
                results.append(ValidationItem(check=spec.name, status="Failed (numeric value expected for unit)"))
        except Exception as e:
            results.append(ValidationItem(check=spec.name, status=f"Failed ({str(e)})"))
            
    return results
