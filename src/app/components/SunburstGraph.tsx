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
}

// Cybersecurity data for AnyChart sunburst - restructured with max 3 segments per layer
const cybersecurityData = [
  // Main categories (first layer)
  {
    id: 'app-cloud',
    parent: 'cybersecurity',
    name: 'Application \n & Cloud \n Security',
    fill: '#ff7300',
    value: 100,
  },
  {
    id: 'identity-access',
    parent: 'cybersecurity',
    name: 'Identity & \n Access',
    fill: 'rgb(240,90,34)',
    value: 75,
  },
  {
    id: 'security-operations',
    parent: 'cybersecurity',
    name: 'Security \n Operations',
    fill: 'rgb(46,139,186)',
    value: 90,
  },
  {
    id: 'emerging-security',
    parent: 'cybersecurity',
    name: 'Emerging \n Security',
    fill: 'rgb(2,175,255)',
    value: 75,
  },
  {
    id: 'network-perimeter',
    parent: 'cybersecurity',
    name: 'Network & \n Perimeter \n Security',
    fill: 'rgb(66,184,213)',
    value: 97,
  },
  {
    id: 'endpoint-security',
    parent: 'cybersecurity',
    name: 'Endpoint \n Security',
    fill: 'rgb(255,187,11)',
    value: 90,
  },
  {
    id: 'data-security',
    parent: 'cybersecurity',
    name: 'Data \n Security',
    fill: 'rgb(255,153,3)',
    value: 75,
  },

  // Application & Cloud Security - Group 1 (Development Security)
  {
    id: 'app-dev-group',
    parent: 'app-cloud',
    name: 'Development \n Security',
    fill: '#ff8533',
    value: 40,
  },
  {
    id: 'app-dast-sast',
    parent: 'app-dev-group',
    name: 'DAST, SAST & SCA',
    value: 16,
  },
  {
    id: 'app-appsec-api',
    parent: 'app-dev-group',
    name: 'APPSEC, API Security & DevSecOps',
    value: 24,
  },

  // Application & Cloud Security - Group 2 (Cloud Protection)
  {
    id: 'app-cloud-group',
    parent: 'app-cloud',
    name: 'Cloud \n Protection',
    fill: '#ffa366',
    value: 35,
  },
  {
    id: 'app-cwpp-cspm',
    parent: 'app-cloud-group',
    name: 'CWPP, CSPM & KSPM',
    value: 14,
  },
  {
    id: 'app-cnapp-sspm',
    parent: 'app-cloud-group',
    name: 'CNAPP & SSPM',
    value: 10,
  },
  {
    id: 'app-ddos-bot',
    parent: 'app-cloud-group',
    name: 'DDOS & BOT Protection',
    value: 11,
  },

  // Application & Cloud Security - Group 3 (Runtime Security)
  {
    id: 'app-runtime-group',
    parent: 'app-cloud',
    name: 'Runtime \n Security',
    fill: '#ffb380',
    value: 25,
  },
  {
    id: 'app-rasp-waf',
    parent: 'app-runtime-group',
    name: 'RASP, WAF & Container Security',
    value: 20,
  },

  // Identity & Access - Group 1 (Authentication)
  {
    id: 'identity-auth-group',
    parent: 'identity-access',
    name: 'SSO & \n MFA',
    fill: '#ff8533',
    value: 25,
  },

  // Identity & Access - Group 2 (Access Management)
  {
    id: 'identity-access-group',
    parent: 'identity-access',
    name: 'IAM, IGA, \n CIAM & \n ISPM',
    fill: '#ffa366',
    value: 30,
  },

  // Identity & Access - Group 3 (Privileged Access)
  {
    id: 'identity-priv-group',
    parent: 'identity-access',
    name: 'PAM',
    fill: '#ffb380',
    value: 20,
  },

  // Security Operations - Group 1 (Detection & Response)
  {
    id: 'secops-detection-group',
    parent: 'security-operations',
    name: 'XDR \n MDR',
    fill: '#5a9fd4',
    value: 45,
  },
  {
    id: 'secops-siem-soar',
    parent: 'secops-detection-group',
    name: 'SIEM, \n SOAR, \n UBEA, \n SOC',
    value: 22.5,
  },
  {
    id: 'secops-xdr-mdr-sub',
    parent: 'secops-detection-group',
    name: 'XDR MDR',
    value: 22.5,
  },

  // Security Operations - Group 2 (Governance & Recovery)
  {
    id: 'secops-gov-group',
    parent: 'security-operations',
    name: 'TPRM & \n GRC',
    fill: '#6bb3e0',
    value: 33,
  },
  {
    id: 'secops-tprm-grc-sub',
    parent: 'secops-gov-group',
    name: 'TPRM & GRC',
    value: 16.5,
  },
  {
    id: 'secops-backup-dr',
    parent: 'secops-gov-group',
    name: 'Back up & \n Disaster \n Recovery',
    value: 16.5,
  },

  // Security Operations - Group 3 (Incident Response)
  {
    id: 'secops-incident-group',
    parent: 'security-operations',
    name: 'Incident \n Response, \n Forensics',
    fill: '#7cc7ec',
    value: 17,
  },
  {
    id: 'secops-incident-response',
    parent: 'secops-incident-group',
    name: 'Incident Response',
    value: 8.5,
  },
  {
    id: 'secops-forensics',
    parent: 'secops-incident-group',
    name: 'Forensics',
    value: 8.5,
  },

  // Emerging Security - Group 1 (AI & Automation)
  {
    id: 'emerging-ai-group',
    parent: 'emerging-security',
    name: 'AI & \n Automation',
    fill: '#33b5ff',
    value: 33,
  },
  {
    id: 'emerging-automation-tip',
    parent: 'emerging-ai-group',
    name: 'Automation TIP',
    value: 15,
  },
  {
    id: 'emerging-ai-security',
    parent: 'emerging-ai-group',
    name: 'AI Security, AIPM',
    value: 18,
  },

  // Emerging Security - Group 2 (Training & Awareness)
  {
    id: 'emerging-training-group',
    parent: 'emerging-security',
    name: 'Training & \n Awareness',
    fill: '#66c2ff',
    value: 20,
  },
  {
    id: 'emerging-awareness-training',
    parent: 'emerging-training-group',
    name: 'Security Awareness Training',
    value: 20,
  },

  // Emerging Security - Group 3 (Advanced Security)
  {
    id: 'emerging-advanced-group',
    parent: 'emerging-security',
    name: 'Advanced \n Security',
    fill: '#99d1ff',
    value: 22,
  },
  {
    id: 'emerging-offensive',
    parent: 'emerging-advanced-group',
    name: 'Offensive Security',
    value: 12,
  },
  {
    id: 'emerging-ctem-caasm',
    parent: 'emerging-advanced-group',
    name: 'CTEM, CAASM, BAS',
    value: 10,
  },

  // Network & Perimeter Security - Group 1 (Core Network)
  {
    id: 'network-core-group',
    parent: 'network-perimeter',
    name: 'Core \n Network',
    fill: '#7dd3e6',
    value: 40,
  },
  {
    id: 'network-sse-sase',
    parent: 'network-core-group',
    name: 'SSE, SASE, SWG, NGFW',
    value: 22,
  },
  {
    id: 'network-swg-vpn',
    parent: 'network-core-group',
    name: 'SWG, VPN, ZTNA',
    value: 18,
  },

  // Network & Perimeter Security - Group 2 (Detection & Monitoring)
  {
    id: 'network-detection-group',
    parent: 'network-perimeter',
    name: 'Detection & \n Monitoring',
    fill: '#94dceb',
    value: 28,
  },
  {
    id: 'network-ids-ndr',
    parent: 'network-detection-group',
    name: 'IDS NDR',
    value: 18,
  },
  {
    id: 'network-visibility',
    parent: 'network-detection-group',
    name: 'Visibility NSPM',
    value: 10,
  },

  // Network & Perimeter Security - Group 3 (Specialized Security)
  {
    id: 'network-specialized-group',
    parent: 'network-perimeter',
    name: 'Specialized \n Security',
    fill: '#abe5f0',
    value: 27,
  },
  {
    id: 'network-ot-iot',
    parent: 'network-specialized-group',
    name: 'OT & IoT',
    value: 15,
  },
  {
    id: 'network-microseg',
    parent: 'network-specialized-group',
    name: 'Micro-segmentation',
    value: 12,
  },

  // Endpoint Security - Group 1 (Core Protection)
  {
    id: 'endpoint-core-group',
    parent: 'endpoint-security',
    name: 'Core \n Protection',
    fill: '#ffcc33',
    value: 45,
  },
  {
    id: 'endpoint-protection-edr',
    parent: 'endpoint-core-group',
    name: 'Endpoint Protection & EDR',
    value: 25,
  },
  {
    id: 'endpoint-casb-web',
    parent: 'endpoint-core-group',
    name: 'CASB, Web Security',
    value: 20,
  },

  // Endpoint Security - Group 2 (Communication Security)
  {
    id: 'endpoint-comm-group',
    parent: 'endpoint-security',
    name: 'Communication \n Security',
    fill: '#ffd966',
    value: 30,
  },
  {
    id: 'endpoint-email',
    parent: 'endpoint-comm-group',
    name: 'Email Security',
    value: 18,
  },
  {
    id: 'endpoint-sdp-dns',
    parent: 'endpoint-comm-group',
    name: 'SDP & DNS',
    value: 12,
  },

  // Endpoint Security - Group 3 (Browser Security)
  {
    id: 'endpoint-browser-group',
    parent: 'endpoint-security',
    name: 'Browser \n Security',
    fill: '#ffe699',
    value: 15,
  },
  {
    id: 'endpoint-browser-isolation',
    parent: 'endpoint-browser-group',
    name: 'Browser Isolation',
    value: 15,
  },

  // Data Security - Group 1 (Data Protection)
  {
    id: 'data-protection-group',
    parent: 'data-security',
    name: 'Data \n Protection',
    fill: '#ffb84d',
    value: 30,
  },
  {
    id: 'data-dlp-dspm',
    parent: 'data-protection-group',
    name: 'DLP, DSPM, Data Discovery & Classification',
    value: 30,
  },

  // Data Security - Group 2 (Encryption & Keys)
  {
    id: 'data-encryption-group',
    parent: 'data-security',
    name: 'Encryption & \n Keys',
    fill: '#ffcc80',
    value: 45,
  },
  {
    id: 'data-encryption-tokenization',
    parent: 'data-encryption-group',
    name: 'Data Encryption & Tokenization',
    value: 25,
  },
  {
    id: 'data-pki-secrets',
    parent: 'data-encryption-group',
    name: 'PKI & Secret Management',
    value: 20,
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
    };
  }

  componentDidMount() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      this.createChart();
    }, 100);
    this.fetchVendors();
  }

  componentDidUpdate() {
    // No need to recreate chart on prop changes
    // Chart is created once and click handlers are set up in createChart
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
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  createChart = () => {
    const { onVendorsChange } = this.props;

    // Check if container exists
    const container = document.getElementById('sunburst-container');
    if (!container) {
      console.warn('Sunburst container not found');
      return;
    }

    // Clean up existing chart if it exists
    if (this.state.chart) {
      (this.state.chart as { dispose: () => void }).dispose();
    }

    // Create data tree
    const dataTree = anychart.data.tree(cybersecurityData, 'as-table');

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
    chart.labels().rotation(45); // Horizontal text
    // Hide tooltip
    chart.tooltip(false);

    // Hide legend
    chart.legend(false);

    // Add rotation to text for readability
    //chart.labels().rotation(0);

    // Custom fill function for better colors
    chart.fill(function (this: unknown) {
      const colors = [
        '#ff6600',
        '#e55a00',
        '#1e3a8a',
        '#0ea5e9',
        '#0891b2',
        '#eab308',
        '#f59e0b',
      ];
      return colors[(this as { index: number }).index % colors.length];
    });

    // Handle click events
    chart.listen('pointClick', (e: { dataPoint: unknown }) => {
      const clickedData = e.dataPoint;
      this.handleDataPointClick(clickedData, onVendorsChange);
    });

    // Set container and draw chart
    chart.container('sunburst-container');
    chart.draw();

    // Store chart in state
    this.setState({ chart });
  };

  handleDataPointClick = (
    dataPoint: unknown,
    onVendorsChange?: (vendors: Vendor[]) => void
  ) => {
    if (!onVendorsChange) return;

    // Filter vendors based on clicked category
    const { vendors } = this.state;
    const categoryName = (dataPoint as { name: string }).name.toLowerCase();

    const filteredVendors = vendors.filter((vendor: Vendor) => {
      const vendorName = vendor.name.toLowerCase();
      const description = vendor.description?.toLowerCase() || '';

      return (
        vendorName.includes(categoryName) || description.includes(categoryName)
      );
    });

    onVendorsChange(filteredVendors.length > 0 ? filteredVendors : vendors);
  };

  render() {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8">
        <div
          className="relative w-full h-full max-w-4xl max-h-4xl flex items-center justify-center"
          style={{ width: '100%', height: '600px' }}
        >
          {/* Sunburst chart with center space */}
          <div
            id="sunburst-container"
            className="sunburst-chart-container"
            style={{
              width: '100%',
              height: '100%',
              transform: 'rotate(-45deg)',
              transformOrigin: 'center center',
            }}
          ></div>

          {/* Center logo positioned in the middle of the sunburst */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ transform: 'translate(-0%, 5%)' }}
          >
            <div className="w-40 h-40 bg-transparent rounded-full flex items-center justify-center">
              <Image
                src="/logos/Netpoleon ANZ Orange Black .png"
                alt="Netpoleon ANZ Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          .sunburst-chart-container :global(.anychart-credits) {
            display: none;
          }
          .sunburst-chart-container :global(.anychart-container) {
            background: transparent !important;
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
