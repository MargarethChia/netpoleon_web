'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface SubCategory {
  id: string;
  label: string;
  color: string;
  tag: string;
}

interface MainNode {
  id: string;
  label: string;
  color: string;
  subCategories: SubCategory[];
}

// Function to calculate curved positions around a center point
const getCurvedPositions = (
  centerX: number,
  centerY: number,
  radius: number,
  count: number,
  startAngle: number,
  endAngle: number
) => {
  const positions: { x: number; y: number }[] = [];
  const angleStep = (endAngle - startAngle) / (count - 1);

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.push({ x, y });
  }

  return positions;
};

// Function to calculate multi-layer positions
const getMultiLayerPositions = (
  centerX: number,
  centerY: number,
  subCategories: SubCategory[],
  nodeIndex: number
) => {
  const positions: { x: number; y: number; layer: number }[] = [];

  // Dynamic first layer count: 4-6 by default, 6-8 if more than 10 total nodes
  let firstLayerCount;
  if (subCategories.length > 10) {
    firstLayerCount = 6;
  } else {
    firstLayerCount = 4;
  }

  const secondLayerCount = subCategories.length - firstLayerCount;

  // Base radius for first layer - increased distance from main node
  const firstLayerRadius = 200;
  const secondLayerRadius = 300; // 100px further out

  let startAngle, endAngle;

  // Adjust angles based on main node position for better visual flow
  if (nodeIndex === 1) {
    // Protect (right side)
    startAngle = -Math.PI / 3 - Math.PI / 4;
    endAngle = Math.PI / 3 - Math.PI / 4;
  } else if (nodeIndex === 2) {
    // Detect (bottom right)
    startAngle = -Math.PI / 4 + Math.PI / 4;
    endAngle = Math.PI / 4;
  } else if (nodeIndex === 3) {
    // Respond (bottom left)
    startAngle = (9.5 * Math.PI) / 4;
    endAngle = (10.5 * Math.PI) / 4;
  } else if (nodeIndex === 4) {
    // Recover (left side)
    startAngle = (2 * Math.PI) / 4;
    endAngle = (3.25 * Math.PI) / 4;
  } else if (nodeIndex === 5) {
    // Govern (top left)
    startAngle = (3 * Math.PI) / 4;
    endAngle = (5 * Math.PI) / 4;
  } else {
    // Identify (top)
    startAngle = (4.75 * Math.PI) / 4;
    endAngle = (5.75 * Math.PI) / 4;
  }

  // First layer
  if (subCategories.length > 0) {
    const firstLayerPositions = getCurvedPositions(
      centerX,
      centerY,
      firstLayerRadius,
      Math.min(firstLayerCount, subCategories.length),
      startAngle,
      endAngle
    );

    for (let i = 0; i < firstLayerPositions.length; i++) {
      positions.push({
        ...firstLayerPositions[i],
        layer: 0,
      });
    }
  }

  // Second layer (remaining subcategories)
  if (secondLayerCount > 0) {
    const secondLayerPositions = getCurvedPositions(
      centerX,
      centerY,
      secondLayerRadius,
      secondLayerCount,
      startAngle,
      endAngle
    );

    for (let i = 0; i < secondLayerPositions.length; i++) {
      positions.push({
        ...secondLayerPositions[i],
        layer: 1,
      });
    }
  }

  return positions;
};

const mainNodes: MainNode[] = [
  {
    id: 'identify',
    label: 'Identify',
    color: '#E6E6FA',
    subCategories: [
      {
        id: 'visibility-caasm',
        label: 'Visibility CAASM',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'dast-sast-sca',
        label: 'DAST SAST SCA',
        color: '#FF8C00',
        tag: 'Application & Cloud Security',
      },
    ],
  },
  {
    id: 'protect',
    label: 'Protect',
    color: '#E6E6FA',
    subCategories: [
      {
        id: 'ddos-protection',
        label: 'DDOS BOT + BOT Protection',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'microsegmentation',
        label: 'Micro Segmentation',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'swg',
        label: 'SWG',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'vpn',
        label: 'VPN',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'data-discovery',
        label: 'Data Discovery & Classification',
        color: '#FF8C00',
        tag: 'Data Security',
      },
      {
        id: 'dspm-dlp',
        label: 'DSPM DLP',
        color: '#FF8C00',
        tag: 'Data Security',
      },
      {
        id: 'data-encryption',
        label: 'Data Encryption & Tokenization',
        color: '#FF8C00',
        tag: 'Data Security',
      },
      {
        id: 'endpoint-protection',
        label: 'Endpoint Protection',
        color: '#A0522D',
        tag: 'Endpoint Security',
      },
      {
        id: 'ctem-bas',
        label: 'CTEM BAS',
        color: '#A0522D',
        tag: 'Endpoint Security',
      },
      {
        id: 'ztna-sdp-dns',
        label: 'ZTNA SDP DNS',
        color: '#A0522D',
        tag: 'Endpoint Security',
      },
      {
        id: 'sse-sase-swg-ngfw',
        label: 'SSE SASE SWG NGFW',
        color: '#A0522D',
        tag: 'Endpoint Security',
      },
      {
        id: 'appsec-api',
        label: 'APPSEC API Security',
        color: '#FFD700',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'rasp-waf-casb',
        label: 'RASP WAF CASB',
        color: '#FFD700',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'iam-iga-pam',
        label: 'IAM IGA PAM',
        color: '#FFB6C1',
        tag: 'Identity & Access',
      },
      {
        id: 'ai-security',
        label: 'AI Security',
        color: '#696969',
        tag: 'Emerging Security',
      },
    ],
  },
  {
    id: 'detect',
    label: 'Detect',
    color: '#E6E6FA',
    subCategories: [
      {
        id: 'ot-ics-iot',
        label: 'OT ICS IoT',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'edr-xdr-ndr-mdr',
        label: 'EDR XDR NDR MDR',
        color: '#000080',
        tag: 'Security Operations',
      },
    ],
  },
  {
    id: 'respond',
    label: 'Respond',
    color: '#E6E6FA',
    subCategories: [
      {
        id: 'ids-tip',
        label: 'IDS TIP',
        color: '#000080',
        tag: 'Security Operations',
      },
      {
        id: 'siem-soar-ueba-soc',
        label: 'SIEM SOAR UEBA SOC',
        color: '#000080',
        tag: 'Security Operations',
      },
    ],
  },
  {
    id: 'recover',
    label: 'Recover',
    color: '#E6E6FA',
    subCategories: [
      {
        id: 'incident-response',
        label: 'Incident Response',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'backup-disaster-recovery',
        label: 'Backup & Disaster Recovery',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'srm-forensics',
        label: 'SRM Forensics',
        color: '#8B4513',
        tag: 'Network & Perimeter Security',
      },
    ],
  },
  {
    id: 'govern',
    label: 'Govern',
    color: '#E6E6FA',
    subCategories: [
      {
        id: 'container-security',
        label: 'Container Security',
        color: '#7A0000',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'browser-isolation',
        label: 'Browser Isolation',
        color: '#7A0000',
        tag: 'Network & Perimeter Security',
      },
      { id: 'nspm', label: 'NSPM', color: '#8B0000', tag: 'Endpoint Security' },
      {
        id: 'email-security',
        label: 'Email Security',
        color: '#8B0000',
        tag: 'Endpoint Security',
      },
      {
        id: 'cwpp-cnapp-cspm',
        label: 'CWPP CNAPP CSPM',
        color: '#FFD700',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'sspm-kspm',
        label: 'SSPM KSPM',
        color: '#FFD700',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'tprm-grc-caasm',
        label: 'TPRM GRC CAASM',
        color: '#000080',
        tag: 'Security Operations',
      },
      {
        id: 'devsecops',
        label: 'DevSecOps',
        color: '#000080',
        tag: 'Security Operations',
      },
      {
        id: 'anti-phishing-training',
        label: 'Anti Phishing Training',
        color: '#696969',
        tag: 'Emerging Security',
      },
      {
        id: 'security-awareness-training',
        label: 'Security Awareness Training',
        color: '#696969',
        tag: 'Emerging Security',
      },
    ],
  },
];

export default function ForceBasedGraph() {
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600, centerX: 400, centerY: 300 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(rect.width || 800, 600); // Minimum width
      const height = Math.max(rect.height || 600, 400); // Minimum height
      
      setDimensions({
        width,
        height,
        centerX: width / 2,
        centerY: height / 2
      });
    };

    updateDimensions();
    
    // Add resize listener
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const handleNodeClick = (nodeId: string) => {
    if (clickedNode === nodeId) {
      // Clicking the same node - return to original view
      setClickedNode(null);
      setIsZoomed(false);
    } else {
      // Clicking a different node - zoom in
      setClickedNode(nodeId);
      setIsZoomed(true);
    }
  };

  const handleBackgroundClick = () => {
    // Clicking away from nodes - return to original view
    setClickedNode(null);
    setIsZoomed(false);
  };

  const { width, height, centerX, centerY } = dimensions;
  const radius = Math.min(width, height) * 0.15; // Responsive radius

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[400px]"
    >
        <svg 
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          style={{ display: 'block' }}
          onClick={handleBackgroundClick}
        >
          {/* Connection lines from main nodes to subcategories */}
          <AnimatePresence>
            {clickedNode && mainNodes.find(n => n.id === clickedNode)?.subCategories.map((subCat, index) => {
              const mainNode = mainNodes.find(n => n.id === clickedNode);
              if (!mainNode) return null;
              
              // Calculate position for main node (arranged in a circle)
              const nodeIndex = mainNodes.findIndex(n => n.id === clickedNode);
              const angle = (nodeIndex * 60 - 90) * (Math.PI / 180); // Start from top
              const originalX = centerX + radius * Math.cos(angle);
              const originalY = centerY + radius * Math.sin(angle);
              
              // When zoomed, main node is at center, when not zoomed, it's at original position
              const mainNodeX = isZoomed ? centerX : originalX;
              const mainNodeY = isZoomed ? centerY : originalY;
              
              // Calculate multi-layer positions for subcategories
              const positions = getMultiLayerPositions(mainNodeX, mainNodeY, mainNode.subCategories, nodeIndex);
              const subCatPos = positions[index];
              
              return (
                <motion.line
                  key={`line-${subCat.id}`}
                  x1={mainNodeX}
                  y1={mainNodeY}
                  x2={subCatPos.x}
                  y2={subCatPos.y}
                  stroke="#dddddd"
                  strokeWidth={2.5}
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                />
              );
            })}
          </AnimatePresence>

          {/* Subcategory nodes */}
          <AnimatePresence>
            {clickedNode && mainNodes.find(n => n.id === clickedNode)?.subCategories.map((subCat, index) => {
              const mainNode = mainNodes.find(n => n.id === clickedNode);
              if (!mainNode) return null;
              
              const nodeIndex = mainNodes.findIndex(n => n.id === clickedNode);
              const angle = (nodeIndex * 60 - 90) * (Math.PI / 180);
              const originalX = centerX + radius * Math.cos(angle);
              const originalY = centerY + radius * Math.sin(angle);
              
              // When zoomed, main node is at center, when not zoomed, it's at original position
              const mainNodeX = isZoomed ? centerX : originalX;
              const mainNodeY = isZoomed ? centerY : originalY;
              
              // Calculate multi-layer positions for subcategories
              const positions = getMultiLayerPositions(mainNodeX, mainNodeY, mainNode.subCategories, nodeIndex);
              const subCatPos = positions[index];
              
              return (
                <motion.g
                  key={subCat.id}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <circle
                    cx={subCatPos.x}
                    cy={subCatPos.y}
                    r={isZoomed ? 60 : 40}
                    fill={subCat.color}
                    className="drop-shadow-lg"
                  />
                  <text
                    x={subCatPos.x}
                    y={subCatPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={isZoomed ? "14" : "10"}
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {(() => {
                      const words = subCat.label.split(' ');
                      const lineHeight = isZoomed ? 18 : 14;
                      const totalHeight = (words.length - 1) * lineHeight;
                      const startY = -totalHeight / 2;
                      
                      return words.map((word, i) => (
                        <tspan key={i} x={subCatPos.x} dy={i === 0 ? startY : lineHeight}>
                          {word}
                        </tspan>
                      ));
                    })()}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* Main nodes arranged in a circle */}
          {mainNodes.map((node, index) => {
            const angle = (index * 60 - 90) * (Math.PI / 180); // Start from top
            const originalX = centerX + radius * Math.cos(angle);
            const originalY = centerY + radius * Math.sin(angle);

            // Calculate final position based on zoom state
            let finalX = originalX;
            let finalY = originalY;
            
            if (isZoomed && clickedNode === node.id) {
              // Move clicked node to center when zoomed
              finalX = centerX;
              finalY = centerY;
            }

            // Hide other nodes when zoomed in
            if (isZoomed && clickedNode !== node.id) {
              return null;
            }

            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent background click
                  handleNodeClick(node.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <motion.circle
                  cx={finalX}
                  cy={finalY}
                  r={isZoomed && clickedNode === node.id ? 72 : 48}
                  fill={node.color}
                  className="drop-shadow-xl"
                  animate={{
                    scale: clickedNode === node.id ? (isZoomed ? 1.2 : 1.05) : 1,
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeInOut",
                    cx: { duration: 0.6, ease: "easeInOut" },
                    cy: { duration: 0.6, ease: "easeInOut" }
                  }}
                />
                
                <text
                  x={finalX}
                  y={finalY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#000000"
                  fontSize={isZoomed && clickedNode === node.id ? "24" : "18"}
                  fontWeight="bold"
                  className="pointer-events-none"
                  style={{ 
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
  );
}
