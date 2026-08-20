import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MOCK_GRAPH_NODES, MOCK_GRAPH_LINKS } from '../../mock/mockData';

// Generate 3D layout positions for nodes
function positionNodes(nodes) {
  return nodes.map((node, idx) => {
    const angle = (idx / nodes.length) * Math.PI * 2;
    const radius = 3.5 + (idx % 2) * 1.2;
    const y = ((idx % 3) - 1) * 1.5;
    return {
      ...node,
      position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
    };
  });
}

function GraphNode({ node, selectedNode, onSelectNode }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const isSelected = selectedNode?.id === node.id;
  const size = (node.val / 20) * 0.35;

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered || isSelected ? 1.2 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* HTML Label Floating Above Node */}
      <Html distanceFactor={12} position={[0, size + 0.3, 0]} center>
        <div 
          onClick={() => onSelectNode(node)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-display whitespace-nowrap cursor-pointer transition-all duration-300 backdrop-blur-md border ${
            isSelected 
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg ring-2 ring-indigo-400' 
              : hovered 
              ? 'bg-slate-900/90 text-white border-slate-700 shadow-md scale-105' 
              : 'bg-slate-950/70 text-slate-200 border-white/10'
          }`}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}

function GraphLinks({ nodes, links }) {
  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => { map[n.id] = n.position; });
    return map;
  }, [nodes]);

  return (
    <>
      {links.map((link, idx) => {
        const start = nodeMap[link.source];
        const end = nodeMap[link.target];
        if (!start || !end) return null;

        return (
          <Line
            key={idx}
            points={[start, end]}
            color="#6366f1"
            lineWidth={1.5}
            transparent
            opacity={0.4}
          />
        );
      })}
    </>
  );
}

export function KnowledgeGraph3D({ selectedNode, onSelectNode }) {
  const positionedNodes = useMemo(() => positionNodes(MOCK_GRAPH_NODES), []);

  return (
    <div className="w-full h-full relative min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#c084fc" />

        <GraphLinks nodes={positionedNodes} links={MOCK_GRAPH_LINKS} />
        
        {positionedNodes.map(node => (
          <GraphNode
            key={node.id}
            node={node}
            selectedNode={selectedNode}
            onSelectNode={onSelectNode}
          />
        ))}

        <OrbitControls enableZoom={true} maxDistance={15} minDistance={4} />
      </Canvas>
    </div>
  );
}
