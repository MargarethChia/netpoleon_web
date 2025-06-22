'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type NodeColor = 'orange' | 'dark' | 'yellow';
type NodeSize = 'small' | 'medium' | 'large';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: NodeColor;
  size: NodeSize;
}

const nodesData: Node[] = [
  { id: 'vuln-mgt', label: 'Vulnerability Mgt', x: 360, y: 405, color: 'dark', size: 'medium' },
  { id: 'threat-intel', label: 'Threat Intel', x: 300, y: 135, color: 'orange', size: 'medium' },
  { id: 'ad-security', label: 'AD Security', x: 216, y: 270, color: 'dark', size: 'small' },
  { id: 'container-security', label: 'Container Security', x: 96, y: 135, color: 'yellow', size: 'small' },
  { id: 'appsec', label: 'APPSEC\nDAST SAST\nSCA', x: 96, y: 270, color: 'yellow', size: 'small' },
  { id: 'cwpp', label: 'CWPP\nCNAPP\nCSPM', x: 120, y: 585, color: 'orange', size: 'large' },
  { id: 'api-security', label: 'API Security', x: 264, y: 630, color: 'yellow', size: 'small' },
  { id: 'data-security', label: 'Data Security\nEncryption\nClassification\nDatabase\nDSPM', x: 180, y: 765, color: 'orange', size: 'large' },
  { id: 'ot-ics-iot', label: 'OT\nICS\nIoT', x: 396, y: 675, color: 'dark', size: 'small' },
  { id: 'segmentation', label: 'Segmentation', x: 540, y: 630, color: 'orange', size: 'medium' },
  { id: 'iam', label: 'IAM\nIGA\nPAM', x: 576, y: 792, color: 'orange', size: 'large' },
  { id: 'tprm-grc', label: 'TPRM\nGRC', x: 756, y: 765, color: 'yellow', size: 'small' },
  { id: 'validation', label: 'Validation\nCTEM\nBAS\nAssurance', x: 900, y: 675, color: 'orange', size: 'medium' },
  { id: 'ndr', label: 'NDR\nVisibility IDS', x: 1056, y: 765, color: 'yellow', size: 'small' },
  { id: 'sase', label: 'SASE\nFirewall\nVPN\nZTNA', x: 1020, y: 540, color: 'orange', size: 'large' },
  { id: 'nspm', label: 'NSPM', x: 1140, y: 405, color: 'dark', size: 'small' },
  { id: 'anti-phishing', label: 'Anti\nPhishing\nTraining', x: 1056, y: 270, color: 'yellow', size: 'small' },
  { id: 'email-security', label: 'Email Security', x: 960, y: 135, color: 'orange', size: 'medium' },
  { id: 'sse', label: 'SSE\nSWG\nCASB\nDLP', x: 840, y: 315, color: 'orange', size: 'large' },
  { id: 'waf-ddos-bot', label: 'WAF\nDDOS\nBOT', x: 780, y: 90, color: 'orange', size: 'medium' },
  { id: 'endpoint-protection', label: 'Endpoint Protection\nEDR\nXDR', x: 660, y: 450, color: 'dark', size: 'large' },
  { id: 'siem', label: 'SIEM\nSOAR\nUEBA\nAutonomous SOC', x: 600, y: 225, color: 'orange', size: 'large' },
  { id: 'sspm', label: 'SSPM', x: 504, y: 360, color: 'yellow', size: 'small' },
  { id: 'caasm', label: 'CAASM', x: 420, y: 225, color: 'yellow', size: 'small' },
];

const edgesData = [
  { from: 'vuln-mgt', to: 'threat-intel' }, { from: 'vuln-mgt', to: 'ad-security' },
  { from: 'vuln-mgt', to: 'container-security' }, { from: 'vuln-mgt', to: 'appsec' },
  { from: 'vuln-mgt', to: 'cwpp' }, { from: 'vuln-mgt', to: 'api-security' },
  { from: 'vuln-mgt', to: 'data-security' }, { from: 'vuln-mgt', to: 'ot-ics-iot' },
  { from: 'vuln-mgt', to: 'segmentation' }, { from: 'vuln-mgt', to: 'endpoint-protection' },
  { from: 'vuln-mgt', to: 'sspm' }, { from: 'vuln-mgt', to: 'caasm' },
  { from: 'threat-intel', to: 'siem' }, { from: 'caasm', to: 'siem' },
  { from: 'sspm', to: 'siem' }, { from: 'siem', to: 'sse' },
  { from: 'siem', to: 'endpoint-protection' }, { from: 'waf-ddos-bot', to: 'sse' },
  { from: 'email-security', to: 'sse' }, { from: 'sse', to: 'sase' },
  { from: 'endpoint-protection', to: 'sase' }, { from: 'endpoint-protection', to: 'siem' },
  { from: 'anti-phishing', to: 'email-security' }, { from: 'anti-phishing', to: 'sase' },
  { from: 'nspm', to: 'sase' }, { from: 'sase', to: 'ndr' },
  { from: 'sase', to: 'validation' }, { from: 'validation', to: 'iam' },
  { from: 'ndr', to: 'sase' }, { from: 'tprm-grc', to: 'iam' },
  { from: 'segmentation', to: 'iam' }, { from: 'segmentation', to: 'ot-ics-iot' },
  { from: 'segmentation', to: 'endpoint-protection' }, { from: 'data-security', to: 'api-security' },
  { from: 'api-security', to: 'cwpp' },
];

const colorClasses: Record<NodeColor, string> = {
  orange: 'fill-[#d9663b] hover:fill-[#e77f5a]',
  dark: 'fill-gray-700 hover:fill-gray-600',
  yellow: 'fill-amber-400 hover:fill-amber-300',
};

const sizeToRadius: Record<NodeSize, number> = {
  small: 48,
  medium: 64,
  large: 80,
};

const sizeToFontSize: Record<NodeSize, number> = {
  small: 12,
  medium: 14,
  large: 16,
};

export default function GraphDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeById = (id: string) => nodesData.find(n => n.id === id);

  const isEdgeConnected = (edge: { from: string, to: string }) => {
    if (!hoveredNode) return false;
    return edge.from === hoveredNode || edge.to === hoveredNode;
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Netpoleon defined domains</h2>
        <p className="text-gray-500 mt-2">Version 2.5 May 2025</p>
      </div>
      <div className="relative w-full max-w-6xl mx-auto mt-12" style={{ aspectRatio: '1200 / 900' }}>
        <svg viewBox="0 0 1200 900" className="absolute top-0 left-0 w-full h-full">
          {/* Edges */}
          {edgesData.map((edge, i) => {
            const fromNode = getNodeById(edge.from);
            const toNode = getNodeById(edge.to);
            if (!fromNode || !toNode) return null;

            const fromRadius = sizeToRadius[fromNode.size];
            const toRadius = sizeToRadius[toNode.size];

            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return null;

            const x1_edge = fromNode.x + (dx * fromRadius / dist);
            const y1_edge = fromNode.y + (dy * fromRadius / dist);
            const x2_edge = toNode.x - (dx * toRadius / dist);
            const y2_edge = toNode.y - (dy * toRadius / dist);

            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={x1_edge} y1={y1_edge}
                x2={x2_edge} y2={y2_edge}
                strokeWidth={isEdgeConnected(edge) ? 2.5 : 1.5}
                className={`transition-all duration-300 ${isEdgeConnected(edge) ? 'stroke-slate-600' : 'stroke-slate-300'}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.02 }}
              />
            );
          })}

          {/* Nodes */}
          {nodesData.map((node, i) => {
            const radius = sizeToRadius[node.size];
            const fontSize = sizeToFontSize[node.size];
            const labelLines = node.label.split('\n');
            const lineHeight = fontSize * 1.1;
            const startY = -((labelLines.length - 1) * lineHeight) / 2;

            return (
              <motion.g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer', zIndex: hoveredNode === node.id ? 10 : 1 }}
              >
                <motion.circle
                  r={radius}
                  className={`transition-all duration-300 ${colorClasses[node.color]}`}
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                  }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  style={{ 
                    fontSize, 
                    fontWeight: 'bold', 
                    pointerEvents: 'none',
                  }}
                >
                  {labelLines.map((line, index) => (
                    <tspan
                      key={index}
                      x="0"
                      dy={index === 0 ? startY : lineHeight}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </section>
  );
} 