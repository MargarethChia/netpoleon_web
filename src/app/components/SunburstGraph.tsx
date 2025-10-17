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
    name: 'SIEM, \n SOAR, \n UBEA, \n SOC',
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
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  createChart = () => {
    // const { onVendorsChange } = this.props;

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
    //chart.labels().rotation(45); // Horizontal text
    // Hide tooltip
    chart.tooltip(false);

    // Hide legend
    chart.legend(false);

    // Handle click events NEED HELP HERE
    /*
    chart.listen('pointClick', (e: any) => {
      console.log('Click event received:', e);
      console.log('Event target:', e.target);
      
      // The target is the AnyChart dataPoint object
      const clickedData = e.target;
      
      // Extract data from AnyChart dataPoint object using its methods
      if (clickedData) {
        try {
          console.log('Attempting to extract data from AnyChart object...');
          console.log('Available methods on clickedData:', Object.getOwnPropertyNames(Object.getPrototypeOf(clickedData)));
          console.log('clickedData keys:', Object.keys(clickedData));
          
          // Try different ways to access the data
          let actualData: any = {};
          
          // Method 1: Try direct property access
          if (clickedData.id) {
            actualData.id = clickedData.id;
          }
          if (clickedData.name) {
            actualData.name = clickedData.name;
          }
          if (clickedData.tag) {
            actualData.tag = clickedData.tag;
          }
          
          // Method 2: Try calling methods if they exist
          if (typeof clickedData.id === 'function') {
            actualData.id = clickedData.id();
          }
          if (typeof clickedData.name === 'function') {
            actualData.name = clickedData.name();
          }
          if (typeof clickedData.tag === 'function') {
            actualData.tag = clickedData.tag();
          }
          
          // Method 3: Try accessing internal properties
          if (clickedData.data) {
            actualData = { ...actualData, ...clickedData.data };
          }
          
          // Method 4: Try accessing properties with different names
          if (clickedData.key) {
            actualData.id = clickedData.key;
          }
          if (clickedData.label) {
            actualData.name = clickedData.label;
          }
          if (clickedData.category) {
            actualData.tag = clickedData.category;
          }
          
          console.log('Extracted actual data:', actualData);
          
          // Check if we got any useful data
          if (actualData.id || actualData.name) {
            this.handleDataPointClick(actualData, onVendorsChange);
          } else {
            console.warn('No useful data extracted, trying to find data in internal properties...');
            // Try to find data in internal AnyChart properties
            console.log('Full clickedData object:', clickedData);
            this.handleDataPointClick(clickedData, onVendorsChange);
          }
        } catch (error) {
          console.error('Error extracting data from AnyChart object:', error);
          // Fallback: pass the raw object
          this.handleDataPointClick(clickedData, onVendorsChange);
        }
      } else {
        console.warn('No clickedData found');
        // Fallback: try other event properties
        const fallbackData = e.dataPoint || e.data || e.target || e;
        this.handleDataPointClick(fallbackData, onVendorsChange);
      }
    });
    */

    // Set container and draw chart
    chart.container('sunburst-container');
    chart.draw();

    // Store chart in state
    this.setState({ chart });
  };

  /*

  handleDataPointClick = (
    dataPoint: unknown,
    onVendorsChange?: (vendors: Vendor[]) => void
  ) => {
    if (!onVendorsChange) return;

    const { vendors } = this.state;
    
    // Check if dataPoint exists
    if (!dataPoint) {
      console.warn('dataPoint is undefined or null');
      onVendorsChange(vendors);
      return;
    }
    
    // Debug: log the dataPoint structure to understand it
    console.log('Clicked dataPoint:', dataPoint);
    
    // Extract data from the clicked segment
    const clickedData = dataPoint as any;
    let categoryTag = '';
    let categoryId = '';
    
    console.log('ClickedData:', clickedData);
    console.log('ClickedData type:', typeof clickedData);
    console.log('ClickedData keys:', Object.keys(clickedData));
    
    // Check if clickedData exists and has the properties we need
    if (clickedData && typeof clickedData === 'object') {
      // Try direct property access (should work now since we extracted it properly)
      if (clickedData.id && typeof clickedData.id === 'string') {
        categoryId = clickedData.id;
        console.log('Got ID via direct access:', categoryId);
      } else if (typeof clickedData.id === 'function') {
        try {
          categoryId = clickedData.id();
          console.log('Got ID via function call:', categoryId);
        } catch (error) {
          console.error('Error calling id() function:', error);
        }
      }
      
      if (clickedData.tag && typeof clickedData.tag === 'string') {
        categoryTag = clickedData.tag;
        console.log('Got tag via direct access:', categoryTag);
      } else if (typeof clickedData.tag === 'function') {
        try {
          categoryTag = clickedData.tag();
          console.log('Got tag via function call:', categoryTag);
        } catch (error) {
          console.error('Error calling tag() function:', error);
        }
      }
      
      // Look up the tag from our cybersecurityData using the ID if we don't have it
      if (!categoryTag && categoryId) {
        const segmentData = cybersecurityData.find(item => item.id === categoryId);
        if (segmentData && segmentData.tag) {
          categoryTag = segmentData.tag;
          console.log('Found tag via lookup:', categoryTag);
        }
      }
      
      // If we still don't have a tag, try to extract it from the name
      if (!categoryTag && clickedData.name) {
        const name = typeof clickedData.name === 'function' ? clickedData.name() : clickedData.name;
        console.log('Trying to extract tag from name:', name);
        // Try to match the name to our data
        const segmentData = cybersecurityData.find(item => 
          item.name.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(item.name.toLowerCase())
        );
        if (segmentData && segmentData.tag) {
          categoryTag = segmentData.tag;
          console.log('Found tag via name matching:', categoryTag);
        }
      }
    }
    
    if (!categoryTag) {
      console.warn('No category tag found in dataPoint:', dataPoint);
      console.warn('ClickedData:', clickedData);
      console.warn('CategoryId:', categoryId);
      // Fallback: show all vendors if we can't determine the category
      onVendorsChange(vendors);
      return;
    }

    console.log('Extracted categoryTag:', categoryTag);
    console.log('Total vendors:', vendors.length);

    // Use tag-based filtering directly from the clicked segment
    let filteredVendors: Vendor[] = [];
    
    if (categoryTag) {
      // Filter vendors based on the extracted tag
      filteredVendors = vendors.filter(vendor => {
        if (!vendor.type) return false;
        // Split comma-separated types and check if any match the clicked tag
        const vendorTypes = vendor.type.split(',').map(type => type.trim());
        const matches = vendorTypes.includes(categoryTag);
        if (matches) {
          console.log('Matching vendor:', vendor.name, 'types:', vendorTypes);
        }
        return matches;
      });
      
      console.log('Filtered vendors count:', filteredVendors.length);
    } else {
      // Fallback to keyword-based filtering for sub-categories
      const categoryToKeywords: Record<string, string[]> = {
        // Application & Cloud Security
        'app-cloud': ['application', 'cloud', 'appsec', 'api', 'devsecops', 'dast', 'sast', 'sca', 'cwpp', 'cspm', 'kspm', 'ddos', 'bot', 'rasp', 'waf', 'container', 'cnapp', 'sspm'],
        'app-dev-group': ['dast', 'sast', 'sca', 'appsec', 'api', 'devsecops'],
        'app-appsec-api': ['appsec', 'api', 'devsecops'],
        'app-cloud-group': ['cwpp', 'cspm', 'kspm'],
        'app-ddos-bot': ['ddos', 'bot', 'protection'],
        'app-runtime-group': ['cnapp', 'sspm'],
        'app-rasp-waf': ['rasp', 'waf', 'container', 'security'],

        // Identity & Access
        'identity-access': ['identity', 'access', 'iam', 'iga', 'ciam', 'ispm', 'sso', 'mfa', 'pam'],
        'identity-auth-group': ['sso', 'mfa', 'authentication'],
        'identity-access-group': ['iam', 'iga', 'ciam', 'ispm'],
        'identity-priv-group': ['pam', 'privileged'],

        // Security Operations
        'security-operations': ['security', 'operations', 'xdr', 'mdr', 'siem', 'soar', 'ubea', 'soc', 'tprm', 'grc', 'backup', 'disaster', 'recovery', 'incident', 'response', 'forensics'],
        'secops-detection-group': ['xdr', 'mdr'],
        'secops-siem-soar': ['siem', 'soar', 'ubea', 'soc'],
        'secops-gov-group': ['tprm', 'grc'],
        'secops-backup-dr': ['backup', 'disaster', 'recovery'],
        'secops-incident-group': ['incident', 'response', 'forensics'],

        // Emerging Security
        'emerging-security': ['emerging', 'automation', 'tip', 'awareness', 'training', 'ai', 'security', 'aipm', 'ctem', 'caasm', 'bas', 'offensive'],
        'emerging-ai-group': ['automation', 'tip'],
        'emerging-awareness-training': ['awareness', 'training'],
        'emerging-training-group': ['ai', 'security', 'aipm'],
        'emerging-ctem-caasm': ['ctem', 'caasm', 'bas'],
        'emerging-advanced-group': ['offensive', 'security'],

        // Network & Perimeter Security
        'network-perimeter': ['network', 'perimeter', 'ids', 'inr', 'sse', 'sase', 'swg', 'ngfw', 'vpn', 'ztna', 'visibility', 'nspm', 'ot', 'iot', 'microsegmentation'],
        'network-core-group': ['ids', 'inr'],
        'network-swg-vpn': ['sse', 'sase', 'swg', 'ngfw'],
        'network-detection-group': ['swg', 'vpn', 'ztna'],
        'network-ids-ndr': ['visibility', 'nspm'],
        'network-specialized-group': ['ot', 'iot'],
        'network-microseg': ['microsegmentation'],

        // Endpoint Security
        'endpoint-security': ['endpoint', 'protection', 'edr', 'casb', 'web', 'security', 'email', 'sdp', 'dns', 'browser', 'isolation'],
        'endpoint-core-group': ['browser', 'isolation'],
        'endpoint-casb-web': ['casb', 'web', 'security'],
        'endpoint-comm-group': ['email', 'security'],
        'endpoint-protection-edr': ['endpoint', 'protection', 'edr'],
        'endpoint-browser-group': ['sdp', 'dns'],

        // Data Security
        'data-security': ['data', 'security', 'encryption', 'tokenization', 'dlp', 'dspm', 'discovery', 'classification', 'pki', 'secret', 'management'],
        'data-protection-group': ['data', 'encryption', 'tokenization'],
        'data-encryption-group': ['dlp', 'dspm', 'discovery', 'classification'],
      };

      // Get keywords for the clicked category
      const keywords = categoryToKeywords[categoryId] || [];
      
      // If no specific keywords found, try to extract from category name
      if (keywords.length === 0) {
        const nameWords = categoryTag.toLowerCase().split(/[\s&,\n]+/).filter((word: string) => word.length > 2);
        keywords.push(...nameWords);
      }

      // Filter vendors based on keywords
      filteredVendors = vendors.filter((vendor: Vendor) => {
        const vendorName = vendor.name.toLowerCase();
        const description = vendor.description?.toLowerCase() || '';
        const vendorType = vendor.type?.toLowerCase() || '';

        // Check if any keyword matches vendor name, description, or type
        return keywords.some(keyword => 
          vendorName.includes(keyword) || 
          description.includes(keyword) ||
          vendorType.includes(keyword)
        );
      });
    }

    // If no vendors found with specific filtering, show all vendors
    onVendorsChange(filteredVendors.length > 0 ? filteredVendors : vendors);
  };
  */
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
            <div className="w-50 h-50 rounded-full flex items-center justify-center">
              <Image
                src="/logos/Netpoleon ANZ Orange Black .png"
                alt="Netpoleon ANZ Logo"
                width={100}
                height={100}
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
