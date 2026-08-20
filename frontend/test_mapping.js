async function test() {
  const response = await fetch('http://localhost:8000/api/products');
  const data = await response.json();
  
  const mapProduct = (p) => ({
    id: p.id,
    sku: p.sku || "N/A",
    name: p.product_name || "Unknown Product",
    category: p.taxonomy?.category || "Uncategorized",
    status: "Verified",
    confidence: 95,
    dateAdded: p.created_at ? new Date(p.created_at).toLocaleString() : "Unknown",
    documentName: "Document",
    fileSize: "N/A",
    pagesCount: 0,
    reviewNeeded: false,
    extractedFields: p.specifications?.map((s, i) => ({
      id: "f" + i,
      name: s.name,
      value: s.value,
      confidence: (s.confidence || 0.95) * 100,
      verified: true,
      boundingBox: s.source_page ? { page: s.source_page } : null
    })) || [],
    relationships: []
  });

  const products = data.map(mapProduct);
  console.log(JSON.stringify(products, null, 2));
}
test();
