'use client';

import React, { Component } from 'react';
// @ts-expect-error - anychart types not available
import anychart from 'anychart';
import Image from 'next/image';
import { vendorsApi, type Vendor } from '@/lib/api';

interface SunburstGraphProps {
  onVendorsChange?: (vendors: Vendor[]) => void;
}

interface SunburstGraphState {
  chart: unknown;
  vendors: Vendor[];
  selectedSegment: string | null;
}

// Mapping between sunburst segment IDs and vendor types - copied from ForceBasedGraph
/*
const nodeTypeMapping: { [key: string]: string[] } = {
  'security-operations': ['Security Operations'],
  'emerging-security': ['Emerging Security'],
  'endpoint-security': ['Endpoint Security'],
  'app-cloud': ['Application & Cloud Security'],
  'network-perimeter': ['Network & Perimeter Security'],
  'data-security': ['Data Security'],
  'identity-access': ['Identity & Access'],
};
*/

// Cybersecurity data for AnyChart sunburst - restructured with max 3 segments per layer
const cybersecurityData = [
  // Main categories (first layer)
  {
    id: 'identity-access',
    parent: 'cybersecurity',
    name: 'Identity & \n Access',
    fill: '#EC5B26',
    value: 75,
    tag: 'Identity & Access',
  },

  {
    id: 'security-operations',
    parent: 'cybersecurity',
    name: 'Security \n Operations',
    fill: '#2F8BBA',
    value: 90,
    tag: 'Security Operations',
  },
  {
    id: 'emerging-security',
    parent: 'cybersecurity',
    name: 'Emerging \n Security',
    fill: '#00AFFF',
    value: 75,
    tag: 'Emerging Security',
  },
  {
    id: 'network-perimeter',
    parent: 'cybersecurity',
    name: 'Network & \n Perimeter \n Security',
    fill: '#41B9D2',
    value: 97,
    tag: 'Network & Perimeter Security',
  },
  {
    id: 'endpoint-security',
    parent: 'cybersecurity',
    name: 'Endpoint \n Security',
    fill: '#FEBB0A',
    value: 90,
    tag: 'Endpoint Security',
  },
  {
    id: 'data-security',
    parent: 'cybersecurity',
    name: 'Data \n Security',
    fill: '#FE9903',
    value: 75,
    tag: 'Data Security',
  },
  {
    id: 'app-cloud',
    parent: 'cybersecurity',
    name: 'Application \n & Cloud \n Security',
    fill: '#ff7300',
    value: 100,
    tag: 'Application & Cloud Security',
  },

  // Application & Cloud Security - Group 1 (Development Security)
  {
    id: 'app-dev-group',
    parent: 'app-cloud',
    name: 'DAST, \n SAST & \n SCA',
    fill: '#FF9B33',
    value: 33,
    tag: 'Application & Cloud Security',
  },
  {
    id: 'app-appsec-api',
    parent: 'app-dev-group',
    name: 'APPSEC, API \n Security & \n DevSecOps',
    value: 33,
    fill: '#FF9A31',
    tag: 'Application & Cloud Security',
  },

  // Application & Cloud Security - Group 2 (Cloud Protection)
  {
    id: 'app-cloud-group',
    parent: 'app-cloud',
    name: 'CWPP, \n CSPM & \n KSPM',
    fill: '#FF9B33',
    value: 33,
    tag: 'Application & Cloud Security',
  },
  {
    id: 'app-ddos-bot',
    parent: 'app-cloud-group',
    name: 'DDOS & BOT \n + BOT \n Protection',
    value: 33,
    fill: '#FF9A31',
    tag: 'Application & Cloud Security',
  },

  // Application & Cloud Security - Group 3 (Runtime Security)
  {
    id: 'app-runtime-group',
    parent: 'app-cloud',
    name: 'CNAPP & \n SSPM',
    fill: '#FF9B33',
    value: 33,
    tag: 'Application & Cloud Security',
  },
  {
    id: 'app-rasp-waf',
    parent: 'app-runtime-group',
    name: 'RASP, WAF & \n Container \n Security',
    value: 33,
    fill: '#FF9A31',
    tag: 'Application & Cloud Security',
  },

  // Identity & Access - Group 1 (Authentication)
  {
    id: 'identity-auth-group',
    parent: 'identity-access',
    name: 'SSO & \n MFA',
    fill: '#FF7243',
    value: 25,
    tag: 'Identity & Access',
  },

  // Identity & Access - Group 2 (Access Management)
  {
    id: 'identity-access-group',
    parent: 'identity-access',
    name: 'IAM, IGA, \n CIAM & \n ISPM',
    fill: '#FF7243',
    value: 33,
    tag: 'Identity & Access',
  },

  // Identity & Access - Group 3 (Privileged Access)
  {
    id: 'identity-priv-group',
    parent: 'identity-access',
    name: 'PAM',
    fill: '#FF7243',
    value: 20,
    tag: 'Identity & Access',
  },

  // Security Operations - Group 1 (Detection & Response)
  {
    id: 'secops-detection-group',
    parent: 'security-operations',
    name: 'XDR \n MDR',
    fill: '#64ACC2',
    value: 45,
    tag: 'Security Operations',
  },
  {
    id: 'secops-siem-soar',
    parent: 'secops-detection-group',
    name: 'SIEM, \n SOAR, \n UEBA, \n SOC',
    value: 22.5,
    fill: '#67ABC2',
    tag: 'Security Operations',
  },

  // Security Operations - Group 2 (Governance & Recovery)
  {
    id: 'secops-gov-group',
    parent: 'security-operations',
    name: 'TPRM & \n GRC',
    fill: '#64ACC2',
    value: 33,
    tag: 'Security Operations',
  },

  {
    id: 'secops-backup-dr',
    parent: 'secops-gov-group',
    name: 'Back up & \n Disaster \n Recovery',
    value: 16.5,
    fill: '#67ABC2',
    tag: 'Security Operations',
  },

  // Security Operations - Group 3 (Incident Response)
  {
    id: 'secops-incident-group',
    parent: 'security-operations',
    name: 'Incident \n Response, \n Forensics',
    fill: '#64ACC2',
    value: 17,
    tag: 'Security Operations',
  },

  // Emerging Security - Group 1 (AI & Automation)
  {
    id: 'emerging-ai-group',
    parent: 'emerging-security',
    name: 'Automation \n TIP',
    fill: '#6ED1F1',
    value: 25,
    tag: 'Emerging Security',
  },
  {
    id: 'emerging-awareness-training',
    parent: 'emerging-ai-group',
    name: 'Security \n Awareness \n Training',
    value: 25,
    fill: '#7AD6FF',
    tag: 'Emerging Security',
  },

  // Emerging Security - Group 2 (Training & Awareness)
  {
    id: 'emerging-training-group',
    parent: 'emerging-security',
    name: 'AI Security, \n AIPM',
    fill: '#6ED1F1',
    value: 25,
    tag: 'Emerging Security',
  },
  {
    id: 'emerging-ctem-caasm',
    parent: 'emerging-training-group',
    name: 'CTEM, \n CAASM, \n BAS',
    value: 25,
    fill: '#7AD6FF',
    tag: 'Emerging Security',
  },

  // Emerging Security - Group 3 (Advanced Security)
  {
    id: 'emerging-advanced-group',
    parent: 'emerging-security',
    name: 'Offensive \n Security',
    fill: '#6ED1F1',
    value: 25,
    tag: 'Emerging Security',
  },

  // Network & Perimeter Security - Group 1 (Core Network)
  {
    id: 'network-core-group',
    parent: 'network-perimeter',
    name: 'IDS \n INR',
    fill: '#77C0D1',
    value: 32,
    tag: 'Network & Perimeter Security',
  },

  {
    id: 'network-swg-vpn',
    parent: 'network-core-group',
    name: 'SSE, \n SASE, \n SWG, \n NGFW',
    value: 32,
    fill: '#77C0D1',
    tag: 'Network & Perimeter Security',
  },

  // Network & Perimeter Security - Group 2 (Detection & Monitoring)
  {
    id: 'network-detection-group',
    parent: 'network-perimeter',
    name: 'SWG, \n VPN, \n ZTNA',
    fill: '#77C0D1',
    value: 32,
    tag: 'Network & Perimeter Security',
  },
  {
    id: 'network-ids-ndr',
    parent: 'network-detection-group',
    name: 'Visibility \n NSPM',
    value: 32,
    fill: '#77C0D1',
    tag: 'Network & Perimeter Security',
  },

  // Network & Perimeter Security - Group 3 (Specialized Security)
  {
    id: 'network-specialized-group',
    parent: 'network-perimeter',
    name: 'OT & IoT',
    fill: '#77C0D1',
    value: 32,
    tag: 'Network & Perimeter Security',
  },
  {
    id: 'network-microseg',
    parent: 'network-specialized-group',
    name: 'Micro- \n segmentation',
    value: 32,
    fill: '#77C0D1',
    tag: 'Network & Perimeter Security',
  },

  // Endpoint Security - Group 1 (Core Protection)
  {
    id: 'endpoint-core-group',
    parent: 'endpoint-security',
    name: 'Browser \n Isolation',
    fill: '#FFD054',
    value: 33,
    tag: 'Endpoint Security',
  },

  {
    id: 'endpoint-casb-web',
    parent: 'endpoint-core-group',
    name: 'CASB, \n Web \n Security',
    value: 33,
    fill: '#FFD054',
    tag: 'Endpoint Security',
  },

  // Endpoint Security - Group 2 (Communication Security)
  {
    id: 'endpoint-comm-group',
    parent: 'endpoint-security',
    name: 'Email \n Security',
    fill: '#FFD054',
    value: 33,
    tag: 'Endpoint Security',
  },
  {
    id: 'endpoint-protection-edr',
    parent: 'endpoint-comm-group',
    name: 'Endpoint \n Protection \n & EDR',
    value: 33,
    fill: '#FFD054',
    tag: 'Endpoint Security',
  },

  // Endpoint Security - Group 3 (Browser Security)
  {
    id: 'endpoint-browser-group',
    parent: 'endpoint-security',
    name: 'SDP & \n DNS',
    fill: '#FFD054',
    value: 33,
    tag: 'Endpoint Security',
  },

  // Data Security - Group 1 (Data Protection)
  {
    id: 'data-protection-group',
    parent: 'data-security',
    name: 'Data \n Encryption & \n Tokenization',
    fill: '#FFC058',
    value: 25,
    tag: 'Data Security',
  },

  // Data Security - Group 2 (Encryption & Keys)
  {
    id: 'data-encryption-group',
    parent: 'data-security',
    name: 'DLP, DSPM, \n Data Discovery \n & Classification',
    fill: '#FFC058',
    value: 25,
    tag: 'Data Security',
  },

  // Data Security - Group 2 (Encryption & Keys)
  {
    id: 'data-encryption-group',
    parent: 'data-security',
    name: 'PKI & Secret \n Management',
    fill: '#FFC058',
    value: 25,
    tag: 'Data Security',
  },
];

/**
 * Cybersecurity Sunburst Chart component using AnyChart
 */
class SunburstGraph extends Component<SunburstGraphProps, SunburstGraphState> {
  constructor(props: SunburstGraphProps) {
    super(props);
    this.state = {
      chart: null,
      vendors: [],
      selectedSegment: null,
    };
  }

  componentDidMount() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      this.createChart();
    }, 100);
    this.fetchVendors();
  }

  componentWillUnmount() {
    // Clean up chart when component unmounts
    if (this.state.chart) {
      (this.state.chart as { dispose: () => void }).dispose();
    }
  }

  fetchVendors = async () => {
    try {
      const data = await vendorsApi.getAll();
      this.setState({ vendors: data });
    } catch {}
  };

  // Update chart colors based on selected segment
  updateChartColors = (selectedId: string | null) => {
    const { chart } = this.state;
    if (!chart) return;

    try {
      const chartInstance = chart as unknown;

      // Method: Modify the data directly and recreate chart
      const modifiedData = cybersecurityData.map(item => {
        let shouldKeepOriginalColor = false;

        if (selectedId) {
          // Get all related segments (parent, children, descendants)
          const relatedSegments = this.getRelatedSegments(selectedId);
          shouldKeepOriginalColor = relatedSegments.includes(item.id);
        } else {
          // If selectedId is null, all segments should keep their original colors
          shouldKeepOriginalColor = true;
        }

        return {
          ...item,
          fill: shouldKeepOriginalColor ? item.fill : '#D0D0D0',
        };
      });

      // Create new data tree with modified colors
      const dataTree = anychart.data.tree(modifiedData, 'as-table');

      // Update chart data
      (chartInstance as { data: (tree: unknown) => void }).data(dataTree);

      // Redraw chart
      (chartInstance as { draw: () => void }).draw();
    } catch {}
  };

  // Handle segment click to filter vendors and update colors
  handleSegmentClick = (
    segmentId: string,
    onVendorsChange?: (vendors: Vendor[]) => void
  ) => {
    // If clicking the same segment, reset to show all vendors
    if (this.state.selectedSegment === segmentId) {
      this.setState(
        {
          selectedSegment: null,
        },
        () => {
          // Reset chart colors
          this.updateChartColors(null);
          // Show all vendors
          if (onVendorsChange) {
            onVendorsChange(this.state.vendors);
          }
        }
      );
      return;
    }

    // If clicking on a related segment (parent, child, or sibling), reset to show all vendors
    if (
      this.state.selectedSegment &&
      this.areSegmentsRelated(this.state.selectedSegment, segmentId)
    ) {
      this.setState(
        {
          selectedSegment: null,
        },
        () => {
          // Reset chart colors
          this.updateChartColors(null);
          // Show all vendors
          if (onVendorsChange) {
            onVendorsChange(this.state.vendors);
          }
        }
      );
      return;
    }

    // Update selected segment and chart colors
    this.setState(
      {
        selectedSegment: segmentId,
      },
      () => {
        // Update chart colors
        this.updateChartColors(segmentId);
        // Filter vendors based on the selected segment
        if (onVendorsChange) {
          this.filterVendorsForSegment(segmentId, onVendorsChange);
        }
      }
    );
  };

  // Filter vendors based on selected segment
  filterVendorsForSegment = (
    segmentId: string,
    onVendorsChange: (vendors: Vendor[]) => void
  ) => {
    const { vendors } = this.state;

    // Find the segment data to get its tag
    const segmentData = cybersecurityData.find(item => item.id === segmentId);
    if (!segmentData || !segmentData.tag) {
      onVendorsChange(vendors);
      return;
    }

    const categoryTag = segmentData.tag;

    // Filter vendors based on the category tag
    const filteredVendors = vendors.filter(vendor => {
      if (!vendor.type) return false;
      // Split comma-separated types and check if any match the clicked tag
      const vendorTypes = vendor.type.split(',').map(type => type.trim());
      return vendorTypes.includes(categoryTag);
    });

    onVendorsChange(filteredVendors);
  };

  // Check if two segments are related (parent-child relationship)
  areSegmentsRelated = (segmentId1: string, segmentId2: string): boolean => {
    const relatedSegments1 = this.getRelatedSegments(segmentId1);
    return relatedSegments1.includes(segmentId2);
  };

  getRelatedSegments = (segmentId: string): string[] => {
    const relatedIds = new Set<string>();

    // Add the segment itself
    relatedIds.add(segmentId);

    const segment = cybersecurityData.find(item => item.id === segmentId);
    if (!segment) return Array.from(relatedIds);

    // Find the root ancestor (parent is "cybersecurity")
    const findRootAncestor = (currentId: string): string => {
      const current = cybersecurityData.find(item => item.id === currentId);
      if (!current) return currentId;

      if (current.parent === 'cybersecurity') {
        return currentId; // This is the root ancestor
      }

      return findRootAncestor(current.parent); // Go up the hierarchy
    };

    const rootAncestorId = findRootAncestor(segmentId);

    // Add the root ancestor itself
    relatedIds.add(rootAncestorId);

    // Add all descendants of the root ancestor
    const findDescendants = (parentId: string) => {
      cybersecurityData.forEach(item => {
        if (item.parent === parentId) {
          relatedIds.add(item.id);
          findDescendants(item.id); // Recursively find children of children
        }
      });
    };

    findDescendants(rootAncestorId);

    return Array.from(relatedIds);
  };

  createChart = () => {
    const { onVendorsChange } = this.props;

    // Check if container exists
    const container = document.getElementById('sunburst-container');
    if (!container) {
      return;
    }

    // Clean up existing chart if it exists
    if (this.state.chart) {
      (this.state.chart as { dispose: () => void }).dispose();
    }

    // Always use full data - no drill-down
    const dataToUse = cybersecurityData;

    // Create data tree
    const dataTree = anychart.data.tree(dataToUse, 'as-table');

    // Create chart
    const chart = anychart.sunburst(dataTree);

    // Configure chart
    chart.calculationMode('parent-independent');
    chart.title('');
    chart.palette([
      '#ff6600',
      '#e55a00',
      '#1e3a8a',
      '#0ea5e9',
      '#0891b2',
      '#eab308',
      '#f59e0b',
      '#ff8533',
      '#ffa366',
      '#ffb380',
      '#ffc299',
      '#ffd1b3',
    ]);

    // Configure inner radius to create space for center logo (smaller inner radius = bigger segments)
    chart.innerRadius('25%');

    // Configure labels with smaller text
    chart.labels().format('{%Name}');
    chart.labels().fontSize(8); // Smaller text size
    chart.labels().fontColor('#ffffff');
    chart.labels().fontWeight('bold');
    chart.labels().position('center');
    chart.interactivity().selectionMode('none');

    // Hide tooltip
    chart.tooltip(false);

    // Hide legend
    chart.legend(false);

    // Hide Contect Menu
    chart.contextMenu(false);

    // Handle click events for segment selection using pointclick event
    chart.listen('pointclick', (e: unknown) => {
      // Extract the event data with pointIndex
      const eventData = e as {
        pointIndex?: number;
        target?: unknown;
        series?: unknown;
        point?: unknown;
        originalEvent?: unknown;
      };

      // Use pointIndex to get the clicked segment data
      if (typeof eventData.pointIndex === 'number') {
        const pointIndex = eventData.pointIndex;

        // Get the clicked point data using chart.ce(pointIndex)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clickedPoint = (chart as any).ce(pointIndex);

        if (clickedPoint) {
          // Extract segment ID from the clicked point
          let segmentId = '';

          // Try to get ID from the point data
          if (clickedPoint.get && typeof clickedPoint.get === 'function') {
            segmentId = clickedPoint.get('id') || '';
          }

          // If no ID found, try other methods
          if (!segmentId) {
            // Try direct property access
            if (clickedPoint.id) {
              segmentId =
                typeof clickedPoint.id === 'function'
                  ? clickedPoint.id()
                  : String(clickedPoint.id);
            } else if (clickedPoint.key) {
              segmentId =
                typeof clickedPoint.key === 'function'
                  ? clickedPoint.key()
                  : String(clickedPoint.key);
            } else if (clickedPoint.name) {
              // Try to match by name as fallback
              const name =
                typeof clickedPoint.name === 'function'
                  ? clickedPoint.name()
                  : String(clickedPoint.name);
              const matchingItem = cybersecurityData.find(
                item =>
                  item.name.toLowerCase().replace(/\s+/g, '') ===
                  name.toLowerCase().replace(/\s+/g, '')
              );
              if (matchingItem) {
                segmentId = matchingItem.id;
              }
            }
          }

          if (segmentId) {
            this.handleSegmentClick(segmentId, onVendorsChange);
          }
        }
      }
    });

    // Set container and draw chart
    chart.container('sunburst-container');
    chart.draw();

    // Store chart in state
    this.setState({ chart });
  };

  render() {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div
          className="relative w-full h-full max-w-4xl max-h-4xl flex items-center justify-center"
          style={{ width: '100%', height: '800px', transform: 'scale(1.2)' }}
        >
          {/* Sunburst chart with center space */}
          <div
            id="sunburst-container"
            className="sunburst-chart-container"
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: 'center center',
              background: 'transparent',
            }}
          ></div>

          {/* Center logo positioned in the middle of the sunburst */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ transform: 'translate(-2%, 4%)' }}
          >
            <div className="w-50 h-50 rounded-full flex items-center justify-center -mt-2">
              <Image
                src="/logos/Netpoleon ANZ Orange Black .png"
                alt="Netpoleon ANZ Logo"
                width={100}
                height={100}
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          .sunburst-chart-container :global(.anychart-credits) {
            display: none;
          }
          .sunburst-chart-container :global(.anychart-container svg path) {
            filter: drop-shadow(1px 0px 0px white)
              drop-shadow(-1px 0px 0px white) drop-shadow(0px 1px 0px white)
              drop-shadow(0px -1px 0px white);
          }
          .sunburst-chart-container :global(.anychart-container svg path) {
            stroke: white;
            stroke-width: 2px;
            stroke-linejoin: round;
          }
          .sunburst-chart-container :global(.anychart-container svg) {
            overflow: visible !important;
          }
        `}</style>
      </div>
    );
  }
}

export default SunburstGraph;
