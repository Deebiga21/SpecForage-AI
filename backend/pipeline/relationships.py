import networkx as nx
from typing import Dict, List, Any

# A global graph to store relationships in memory (in a real app, this would be persisted)
_graph = nx.Graph()

def map_relationships(product_data: Any) -> Dict[str, Any]:
    """
    Builds relationships using networkx based on parsed product data.
    """
    global _graph
    
    product_name = product_data.product_name
    _graph.add_node(product_name, type="product")
    
    # Process extracted relationships
    for rel in product_data.relationships.similar:
        _graph.add_node(rel.name, type="product")
        _graph.add_edge(product_name, rel.name, rel_type="similar", weight=rel.confidence)
        
    for rel in product_data.relationships.compatible:
        _graph.add_node(rel.name, type="product")
        _graph.add_edge(product_name, rel.name, rel_type="compatible", weight=rel.confidence)
        
    for rel in product_data.relationships.potential_dup:
        _graph.add_node(rel.name, type="product")
        _graph.add_edge(product_name, rel.name, rel_type="potential_dup", weight=rel.confidence)
        
    return calculate_network_metrics(product_name)

def calculate_network_metrics(product_name: str) -> Dict[str, Any]:
    """
    Find related products using graph traversal and calculate similarity scores.
    """
    if product_name not in _graph:
        return {}
        
    neighbors = list(_graph.neighbors(product_name))
    
    # Example metric: number of direct connections
    metrics = {
        "degree": _graph.degree(product_name),
        "direct_neighbors": neighbors
    }
    
    return metrics
