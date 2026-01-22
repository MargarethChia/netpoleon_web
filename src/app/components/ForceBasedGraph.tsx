'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { vendorsApi, type Vendor } from '@/lib/api';

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

// Function to calculate custom positions for Network & Perimeter Security
const getNetworkPerimeterPositions = (
  centerX: number,
  centerY: number,
  subCategories: SubCategory[]
) => {
  const positions: { x: number; y: number; layer: number }[] = [];

  // Custom positions based on the image layout, centered around the original center
  const customPositions = [
    { x: centerX - 140, y: centerY - 150 }, // Top-left: SSE SASE SWG NGFW
    { x: centerX + 15, y: centerY - 150 }, // Top-middle: IDS NDR
    { x: centerX + 150, y: centerY - 190 }, // Top-right: NSPM
    { x: centerX - 80, y: centerY - 20 }, // Middle-left: Micro-segmentation
    { x: centerX + 90, y: centerY - 40 }, // Middle-right: Visibility CAASM
    { x: centerX - 120, y: centerY + 120 }, // Bottom-left: SWG VPN ZTNA
    { x: centerX + 30, y: centerY + 80 }, // Bottom-right: Email Security
  ];

  for (let i = 0; i < subCategories.length && i < customPositions.length; i++) {
    positions.push({
      ...customPositions[i],
      layer: 0,
    });
  }

  return positions;
};

// Function to calculate custom positions for Endpoint Security
const getEndpointSecurityPositions = (
  centerX: number,
  centerY: number,
  subCategories: SubCategory[]
) => {
  const positions: { x: number; y: number; layer: number }[] = [];

  // Custom positions based on the image layout, centered around the original center
  const customPositions = [
    { x: centerX - 120, y: centerY - 140 }, // Top-left: SDP DNS
    { x: centerX + 50, y: centerY - 100 }, // Top-right: Browser Isolation
    { x: centerX - 80, y: centerY - 0 }, // Middle-left: Endpoint Protection
    { x: centerX + 50, y: centerY + 100 }, // Bottom-left: OT ICS IoT
    { x: centerX - 120, y: centerY + 140 }, // Middle-right: EDR
    { x: centerX + 80, y: centerY + 60 }, // Bottom-right: Endpoint Security
  ];

  for (let i = 0; i < subCategories.length && i < customPositions.length; i++) {
    positions.push({
      ...customPositions[i],
      layer: 0,
    });
  }

  return positions;
};

// Function to calculate custom positions for Data Security
const getDataSecurityPositions = (
  centerX: number,
  centerY: number,
  subCategories: SubCategory[]
) => {
  const positions: { x: number; y: number; layer: number }[] = [];

  // Custom positions based on the image layout, centered around the original center
  const customPositions = [
    { x: centerX - 120, y: centerY - 140 }, // Top-left: Data Encryption & Tokenization
    { x: centerX - 80, y: centerY - 0 }, // Top-right: Data Discovery & Classification
    { x: centerX - 120, y: centerY + 140 }, // Bottom-center: DSPM DLP
  ];

  for (let i = 0; i < subCategories.length && i < customPositions.length; i++) {
    positions.push({
      ...customPositions[i],
      layer: 0,
    });
  }

  return positions;
};

// Function to calculate custom positions for Application & Cloud Security
const getApplicationCloudSecurityPositions = (
  centerX: number,
  centerY: number,
  subCategories: SubCategory[]
) => {
  const positions: { x: number; y: number; layer: number }[] = [];

  // Custom positions based on the image layout, centered around the original center
  const customPositions = [
    { x: centerX - 140, y: centerY - 150 }, // Top-left: APPSEC API Security
    { x: centerX + 15, y: centerY - 150 }, // Top-middle: RASP WAF CASB
    { x: centerX + 150, y: centerY - 190 }, // Top-right: CWPP CNAPP CSPM
    { x: centerX - 80, y: centerY - 20 }, // Middle-left: SSPM KSPM
    { x: centerX + 90, y: centerY - 40 }, // Middle-right: Container Security
    { x: centerX - 120, y: centerY + 120 }, // Bottom-left: DDOS BOT + BPT Protection
    { x: centerX + 30, y: centerY + 80 }, // Bottom-right: (if needed)
  ];

  for (let i = 0; i < subCategories.length && i < customPositions.length; i++) {
    positions.push({
      ...customPositions[i],
      layer: 0,
    });
  }

  return positions;
};

// Function to calculate custom positions for Emerging Security
const getEmergingSecurityPositions = (
  centerX: number,
  centerY: number,
  subCategories: SubCategory[]
) => {
  const positions: { x: number; y: number; layer: number }[] = [];

  // Custom positions based on the image layout, centered around the original center
  const customPositions = [
    { x: centerX - 120, y: centerY - 140 }, // Top-left: AI Security
    { x: centerX - 80, y: centerY - 0 }, // Top-right: Security Awareness Training
    { x: centerX - 120, y: centerY + 140 }, // Bottom-center: Anti Phishing Training
  ];

  for (let i = 0; i < subCategories.length && i < customPositions.length; i++) {
    positions.push({
      ...customPositions[i],
      layer: 0,
    });
  }

  return positions;
};

// Function to calculate custom positions for Security Operations
const getSecurityOperationsPositions = (
  centerX: number,
  centerY: number,
  subCategories: SubCategory[]
) => {
  const positions: { x: number; y: number; layer: number }[] = [];

  // Custom positions based on the image layout, centered around the original center
  const customPositions = [
    { x: centerX - 120, y: centerY - 160 }, // TPRM GRC CAASM
    { x: centerX - 80, y: centerY - 0 }, // SRM Forensics
    { x: centerX - 120, y: centerY + 160 }, // SIEM SOAR UEBA SOC

    { x: centerX + 30, y: centerY - 130 }, // Backup & Disaster Recov
    { x: centerX + 60, y: centerY + 50 }, // XDR MDR
    { x: centerX + 30, y: centerY + 190 }, // CTEM BAS

    { x: centerX + 160, y: centerY - 70 }, // Incident Response
    { x: centerX + 170, y: centerY + 130 }, // DevSecOps
    { x: centerX + 270, y: centerY + 20 }, // Tip
  ];

  for (let i = 0; i < subCategories.length && i < customPositions.length; i++) {
    positions.push({
      ...customPositions[i],
      layer: 0,
    });
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
  // Special case for Application & Cloud Security
  if (nodeIndex === 0) {
    return getApplicationCloudSecurityPositions(
      centerX,
      centerY,
      subCategories
    );
  }

  // Special case for Emerging Security
  if (nodeIndex === 3) {
    return getEmergingSecurityPositions(centerX, centerY, subCategories);
  }

  // Special case for Security Operations
  if (nodeIndex === 2) {
    return getSecurityOperationsPositions(centerX, centerY, subCategories);
  }

  // Special case for Network & Perimeter Security
  if (nodeIndex === 4) {
    return getNetworkPerimeterPositions(centerX, centerY, subCategories);
  }

  // Special case for Endpoint Security
  if (nodeIndex === 5) {
    return getEndpointSecurityPositions(centerX, centerY, subCategories);
  }

  if (nodeIndex === 6) {
    return getDataSecurityPositions(centerX, centerY, subCategories);
  }

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
  const firstLayerRadius = 280; // Increased from 200
  const secondLayerRadius = 380; // Increased from 300

  let startAngle, endAngle;

  // Adjust angles based on main node position for better visual flow
  if (nodeIndex === 1) {
    // Identity & Access (top-right)
    startAngle = -Math.PI / 6;
    endAngle = Math.PI / 6;
  } else if (nodeIndex === 2) {
    // Security Operations (bottom-right)
    startAngle = Math.PI / 6;
    endAngle = Math.PI / 2;
  } else if (nodeIndex === 3) {
    // Emerging Security (bottom)
    startAngle = Math.PI / 2;
    endAngle = (5 * Math.PI) / 6;
  } else if (nodeIndex === 5) {
    // Endpoint Security (left)
    startAngle = (7 * Math.PI) / 6;
    endAngle = (3 * Math.PI) / 2;
  } else if (nodeIndex === 6) {
    // Data Security (top-left)
    startAngle = (3 * Math.PI) / 2;
    endAngle = (11 * Math.PI) / 6;
  } else {
    // Application & Cloud Security (top)
    startAngle = (11 * Math.PI) / 6;
    endAngle = (13 * Math.PI) / 6;
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
    id: 'application-cloud-security',
    label: 'Application & Cloud Security',
    color: '#FFBD59FF', // Yellowish-orange
    subCategories: [
      {
        id: 'appsec-api',
        label: 'APPSEC API Security',
        color: '#FFBD59FF',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'rasp-waf-casb',
        label: 'RASP WAF CASB',
        color: '#FFBD59FF',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'dast-sast-sca',
        label: 'DAST SAST SCA',
        color: '#FFBD59FF',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'cwpp-cnapp-cspm',
        label: 'CWPP CNAPP CSPM',
        color: '#FFBD59FF',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'sspm-kspm',
        label: 'SSPM KSPM',
        color: '#FFBD59FF',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'container-security',
        label: 'Container Security',
        color: '#FFBD59FF',
        tag: 'Application & Cloud Security',
      },
      {
        id: 'ddos-bot-+-bot-protection',
        label: 'DDOS BOT + BPT Protection',
        color: '#FFBD59FF',
        tag: 'Application & Cloud Security',
      },
    ],
  },
  {
    id: 'identity-access',
    label: 'Identity & Access',
    color: '#FFC393FF', // Light peach/pale orange
    subCategories: [
      {
        id: 'iam-iga',
        label: 'IAM IGA',
        color: '#FFC393FF',
        tag: 'Identity & Access',
      },
      {
        id: 'pam',
        label: 'PAM',
        color: '#FFC393FF',
        tag: 'Identity & Access',
      },
    ],
  },
  {
    id: 'security-operations',
    label: 'Security  Operations',
    color: '#042F5EFF', // Dark blue
    subCategories: [
      {
        id: 'tprm-grc-caasm',
        label: 'TPRM GRC CAASM',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'srm-forensics',
        label: 'SRM Forensics',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'siem-soar-ueba-soc',
        label: 'SIEM SOAR UEBA SOC',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'backup-disaster-recovery',
        label: 'Backup & Disaster Recovery',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'xdr-mdr',
        label: 'XDR MDR',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'ctem-bas',
        label: 'CTEM BAS',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'incident-response',
        label: 'Incident Response',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'devsecops',
        label: 'DevSecOps',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
      {
        id: 'tip',
        label: 'TIP',
        color: '#042F5EFF',
        tag: 'Security Operations',
      },
    ],
  },
  {
    id: 'emerging-security',
    label: 'Emerging  Security',
    color: '#545454FF', // Dark grey
    subCategories: [
      {
        id: 'ai-security',
        label: 'AI Security',
        color: '#545454FF',
        tag: 'Emerging Security',
      },
      {
        id: 'security-awareness-training',
        label: 'Security Awareness Training',
        color: '#545454FF',
        tag: 'Emerging Security',
      },
      {
        id: 'anti-phishing-training',
        label: 'Anti Phishing Training',
        color: '#545454FF',
        tag: 'Emerging Security',
      },
    ],
  },
  {
    id: 'network-perimeter-security',
    label: 'Network & Perimeter  Security',
    color: '#690D00FF', // Dark red/maroon
    subCategories: [
      {
        id: 'sse-sase-swg-ngfw',
        label: 'SSE SASE SWG NGFW',
        color: '#690D00FF',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'ids-ndr',
        label: 'IDS NDR',
        color: '#690D00FF',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'nspm',
        label: 'NSPM',
        color: '#690D00FF',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'microsegmentation',
        label: 'Micro- segmentation',
        color: '#690D00FF',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'visibility-caasm',
        label: 'Visibility CAASM',
        color: '#690D00FF',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'swg-vpn-ztna',
        label: 'SWG VPN ZTNA',
        color: '#690D00FF',
        tag: 'Network & Perimeter Security',
      },
      {
        id: 'email-security',
        label: 'Email Security',
        color: '#690D00FF',
        tag: 'Network & Perimeter Security',
      },
    ],
  },
  {
    id: 'endpoint-security',
    label: 'Endpoint  Security',
    color: '#962610FF', // Reddish-brown
    subCategories: [
      {
        id: 'sdp-dns',
        label: 'SDP DNS',
        color: '#962610FF',
        tag: 'Endpoint Security',
      },
      {
        id: 'browser-isolation',
        label: 'Browser Isolation',
        color: '#962610FF',
        tag: 'Endpoint Security',
      },
      {
        id: 'endpoint-protection',
        label: 'Endpoint Protection',
        color: '#962610FF',
        tag: 'Endpoint Security',
      },
      {
        id: 'ot-ics-iot',
        label: 'OT ICS IoT',
        color: '#962610FF',
        tag: 'Endpoint Security',
      },
      {
        id: 'edr',
        label: 'EDR',
        color: '#962610FF',
        tag: 'Endpoint Security',
      },
    ],
  },
  {
    id: 'data-security',
    label: 'Data  Security',
    color: '#FF7A25FF', // Orange
    subCategories: [
      {
        id: 'data-encryption-tokenization',
        label: 'Data Encryption & Tokenization',
        color: '#FF7A25FF',
        tag: 'Data Security',
      },
      {
        id: 'data-discovery-classification',
        label: 'Data Discovery & Classification',
        color: '#FF7A25FF',
        tag: 'Data Security',
      },
      {
        id: 'dspm-dlp',
        label: 'DSPM DLP',
        color: '#FF7A25FF',
        tag: 'Data Security',
      },
    ],
  },
];

// Mapping between main node IDs and vendor types - moved outside component to prevent recreation
const nodeTypeMapping: { [key: string]: string[] } = {
  'security-operations': ['Security Operations'],
  'emerging-security': ['Emerging Security'],
  'endpoint-security': ['Endpoint Security'],
  'application-cloud-security': ['Application & Cloud Security'],
  'network-perimeter-security': ['Network & Perimeter Security'],
  'data-security': ['Data Security'],
  'identity-access': ['Identity & Access'],
};

interface ForceBasedGraphProps {
  onVendorsChange?: (vendors: Vendor[]) => void;
}

export default function ForceBasedGraph({
  onVendorsChange,
}: ForceBasedGraphProps = {}) {
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showFullDiagram, setShowFullDiagram] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600,
    centerX: 400,
    centerY: 300,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const onVendorsChangeRef = useRef(onVendorsChange);

  // Update ref when callback changes
  useEffect(() => {
    onVendorsChangeRef.current = onVendorsChange;
  }, [onVendorsChange]);

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
        centerY: height / 2,
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

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorsApi.getAll();
        const vendorsWithLogos = data.filter(v => v.logo_url);
        setVendors(vendorsWithLogos);
      } catch {}
    };

    fetchVendors();
  }, []);

  // Filter vendors based on clicked node using useMemo
  const filteredVendorsMemo = useMemo(() => {
    if (clickedNode && nodeTypeMapping[clickedNode]) {
      const targetTypes = nodeTypeMapping[clickedNode];
      return vendors.filter(vendor => {
        if (!vendor.type) return false;
        // Split comma-separated types and check if any match
        const vendorTypes = vendor.type.split(',').map(type => type.trim());
        return targetTypes.some(targetType => vendorTypes.includes(targetType));
      });
    } else {
      return vendors; // Show all vendors when no node is clicked
    }
  }, [clickedNode, vendors]);

  // Update filtered vendors state and call callback
  useEffect(() => {
    onVendorsChangeRef.current?.(filteredVendorsMemo);
  }, [filteredVendorsMemo]);

  const handleNodeClick = (nodeId: string) => {
    if (showFullDiagram) return; // Don't handle individual node clicks in full diagram mode

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
    if (showFullDiagram) return; // Don't handle background clicks in full diagram mode
    // Clicking away from nodes - return to original view
    setClickedNode(null);
    setIsZoomed(false);
  };

  const handleFullDiagramToggle = () => {
    setShowFullDiagram(!showFullDiagram);
    setClickedNode(null);
    setIsZoomed(false);
  };

  const { width, height, centerX, centerY } = dimensions;
  const radius = Math.min(width, height) * 0.25; // Increased radius for more spacing

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      {/* Full Diagram Button */}
      <button
        onClick={handleFullDiagramToggle}
        className="absolute top-4 left-4 z-20 bg-gray-300/30 backdrop-blur-lg border border-white/60 hover:bg-gray-300/40 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 backdrop-saturate-150"
      >
        {showFullDiagram ? 'Hide Full Diagram' : 'Full Diagram'}
      </button>

      {showFullDiagram ? (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
          <Image
            unoptimized
            src="/images/full-diagram/full_diagram.png"
            alt="Full Security Diagram"
            width={800}
            height={600}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          style={{ display: 'block' }}
          onClick={handleBackgroundClick}
        >
          {/* Subcategory nodes */}
          <AnimatePresence>
            {(clickedNode
              ? mainNodes.find(n => n.id === clickedNode)?.subCategories || []
              : []
            ).map((subCat, index) => {
              // Find which main node this subcategory belongs to
              const mainNode = mainNodes.find(n =>
                n.subCategories.some(sc => sc.id === subCat.id)
              );
              if (!mainNode) return null;

              const nodeIndex = mainNodes.findIndex(n => n.id === mainNode.id);
              const angle = (nodeIndex * (360 / 7) - 90) * (Math.PI / 180); // Start from top, 7 nodes
              const originalX = centerX + radius * Math.cos(angle);
              const originalY = centerY + radius * Math.sin(angle);

              // Position subcategories around the clicked node's current position
              const mainNodeX = isZoomed
                ? nodeIndex === 0 ||
                  nodeIndex === 2 ||
                  nodeIndex === 3 ||
                  nodeIndex === 4 ||
                  nodeIndex === 5 ||
                  nodeIndex === 6
                  ? centerX
                  : centerX * 0.3
                : originalX;
              const mainNodeY = isZoomed ? centerY : originalY;

              const positions = getMultiLayerPositions(
                mainNodeX,
                mainNodeY,
                mainNode.subCategories,
                nodeIndex
              );
              const subCatPos = positions[index];

              // Safety check to prevent undefined position errors
              if (!subCatPos) {
                return null;
              }

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
                    r={isZoomed ? 60 : 45}
                    fill={subCat.color}
                    className="drop-shadow-lg"
                  />
                  <text
                    x={subCatPos.x}
                    y={subCatPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={isZoomed ? '12' : '8'}
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {(() => {
                      const words = subCat.label.split(' ');
                      const lineHeight = isZoomed ? 15 : 12;
                      const totalHeight = (words.length - 1) * lineHeight;
                      const startY = -totalHeight / 2;

                      return words.map((word, i) => (
                        <tspan
                          key={i}
                          x={subCatPos.x}
                          dy={i === 0 ? startY : lineHeight}
                        >
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
            const angle = (index * (360 / 7) - 90) * (Math.PI / 180); // Start from top, 7 nodes
            const originalX = centerX + radius * Math.cos(angle);
            const originalY = centerY + radius * Math.sin(angle);

            // Calculate final position based on zoom state
            let finalX = originalX;
            let finalY = originalY;

            if (isZoomed && clickedNode === node.id) {
              // Move clicked node to left middle when zoomed
              finalX = centerX * 0.3; // Left side of screen
              finalY = centerY; // Middle vertically
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
                onClick={e => {
                  e.stopPropagation(); // Prevent background click
                  handleNodeClick(node.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <motion.circle
                  cx={finalX}
                  cy={finalY}
                  r={isZoomed && clickedNode === node.id ? 90 : 71}
                  fill={node.color}
                  className="drop-shadow-xl"
                  animate={{
                    scale:
                      clickedNode === node.id ? (isZoomed ? 1.2 : 1.05) : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                    cx: { duration: 0.6, ease: 'easeInOut' },
                    cy: { duration: 0.6, ease: 'easeInOut' },
                  }}
                />

                <text
                  x={finalX}
                  y={finalY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={isZoomed && clickedNode === node.id ? '20' : '14'}
                  fontWeight="bold"
                  className="pointer-events-none"
                  style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {(() => {
                    // Split long labels into multiple lines
                    const words = node.label.split(' ');
                    const maxWordsPerLine = 2;
                    const lines = [];

                    for (let i = 0; i < words.length; i += maxWordsPerLine) {
                      lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
                    }

                    const lineHeight =
                      isZoomed && clickedNode === node.id ? 24 : 18;
                    const totalHeight = (lines.length - 1) * lineHeight;
                    const startY = -totalHeight / 2;

                    return lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={finalX}
                        dy={i === 0 ? startY : lineHeight}
                      >
                        {line}
                      </tspan>
                    ));
                  })()}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
