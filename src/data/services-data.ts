export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface ServiceData {
  id: string;
  title: string;
  categories: string[];
  overview: string[];
  whatsIncluded?: string[];
  keyBenefits?: string[];
  process?: ProcessStep[];
  ctaSection?: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
}

export const servicesData: Record<string, ServiceData> = {
  nxone: {
    id: 'nxone',
    title: 'NXOne - Lead Generation Services',
    categories: ['Lead Generation', 'Sales Development'],
    overview: [
      'NXOne is our dedicated lead generation unit, built to help technology vendors and partners engage the right audiences, generate qualified leads, and accelerate opportunities in the market. We combine our dedicated SDRs, bespoke executive roundtables, and targeted demand generation activities to deliver measurable pipeline outcomes.',
      "Whether you're looking to expand into new accounts, nurture relationships with decision-makers, or fast-track opportunities, NXOne provides tailored programs designed to connect you with the right people at the right time.",
    ],
    whatsIncluded: [
      'SDR as a Service - Dedicated sales development representatives',
      'Bespoke Executive Roundtables - Targeted executive engagement',
      'End User Conferences - Industry-focused events',
      'Demand Generation Campaigns - Comprehensive marketing initiatives',
    ],
    keyBenefits: [
      'Accelerate Pipeline Growth - Generate more qualified meetings and opportunities in less time',
      'Extensive ANZ Database Access - Leverage our database to reach the right decision makers, influencers and accounts across the IT landscape',
      'Scalable Services - Tailored services that scale with your campaign needs and budget from high impact events designed for scale to executive discussions',
      'Measurable ROI - Clear reporting and insights to track campaign performance and pipeline contribution',
    ],
    process: [
      {
        number: 1,
        title: 'Discovery & Alignment',
        description:
          'Align with Sales and Marketing team to define objectives, messaging and target accounts',
      },
      {
        number: 2,
        title: 'Campaign Format',
        description:
          'SDR outreach, roundtables, conferences or other demand-gen activity type',
      },
      {
        number: 3,
        title: 'Account Mapping',
        description: 'Identify and qualify target account list for campaign',
      },
      {
        number: 4,
        title: 'Engagement & Execution',
        description:
          'Outreach, event invitations and follow-ups managed by SDR team',
      },
      {
        number: 5,
        title: 'Reporting & Handover',
        description:
          'Comprehensive reporting on results, insights, and next steps to ensure seamless handover to sales team',
      },
    ],
    ctaSection: {
      title: 'Accelerate Your Pipeline Growth',
      description:
        'Connect with the right decision makers and generate qualified leads with our proven lead generation services.',
      primaryButton: 'Start Lead Generation',
      secondaryButton: 'View Success Stories',
    },
  },
  nable: {
    id: 'nable',
    title: 'N.Able - Technology Enablement Services',
    categories: ['Technology Enablement', 'Training'],
    overview: [
      "Netpoleon's N.Able capability is created to educate and assist our partners and end users on vendor solutions. Our team works in tandem with our vendors to maximize the ability of our partner's ability to position technologies within their customer space and possibly build services offerings as part of their portfolio.",
      "This is achieved through a combination of bespoke enablement sessions, assistance in vendor accreditation, and availing technology platforms to help learn or demonstrate the technology. Netpoleon's objective is to enable both our partners and vendors achieve maximum potential.",
    ],
    whatsIncluded: [
      'Technology and Product Webinars - Educational sessions on vendor solutions',
      'Bespoke Workshops - Customized training programs',
      'One-on-One Meetings - Direct engagement with partners and vendors',
      'Product Demonstrations and PoCs - Hands-on technology showcases',
      'Enablement Services and Technology Platforms - Comprehensive learning resources',
    ],
    keyBenefits: [
      'Contextual Technology Information - Receive relevant industry and technology insights',
      'Consultative Approach - Expert guidance in identifying, qualifying, and responding to opportunities',
      'Adaptable Methods - Flexible approaches to enabling partner offerings and go-to-market strategies',
      'Intimate Business Partnerships - Close collaboration with stakeholders',
    ],
    process: [
      {
        number: 1,
        title: 'Discover Portfolio',
        description: "Explore Netpoleon's entire vendor portfolio",
      },
      {
        number: 2,
        title: 'Identify Technologies',
        description: 'Select technologies and vendors of interest',
      },
      {
        number: 3,
        title: 'Develop Initiatives',
        description: 'Create enablement initiatives tailored to your needs',
      },
      {
        number: 4,
        title: 'Commit Resources',
        description: 'Allocate time and resources for enablement activities',
      },
      {
        number: 5,
        title: 'Achieve Certification',
        description: 'Complete certification and capability delivery',
      },
      {
        number: 6,
        title: 'Schedule Meetings',
        description: 'Organize and deliver go-to-market and customer meetings',
      },
    ],
    ctaSection: {
      title: 'Enable Your Technology Success',
      description:
        'Maximize your technology potential with our comprehensive enablement and training services.',
      primaryButton: 'Start Enablement Program',
      secondaryButton: 'View Training Catalog',
    },
  },
  nsure: {
    id: 'nsure',
    title: 'N.Sure - Professional Services',
    categories: ['Professional Services', 'Cybersecurity'],
    overview: [
      "Netpoleon's N.Sure Professional Services ensures that our Partner's Customers achieve their Cyber Security objectives through certified and experienced delivery engineers and consultants. Recognizing the complexities of maintaining resources on your organisation's bench ready for deployment, Netpoleon offers certified delivery services for our partners to leverage.",
      'Backed by our vendors, we work closely with the subject matter experts to ensure a smooth delivery of the solution, and according to best practices.',
    ],
    whatsIncluded: [
      'Vendor Certified Resources - Qualified and certified delivery professionals',
      'Standardized Service Offerings - Consistent, proven service methodologies',
      'Consulted Scope of Work - Collaborative project scoping and planning',
      'Flexible Commercial Options - Fixed price, time & materials, or on-demand pricing',
      'Metropolitan On-Site Delivery - Local delivery with travel and remote options available',
    ],
    keyBenefits: [
      'Collaborative Delivery - Work closely with Partners while maintaining Customer intimacy',
      'Responsive and Flexible - Customer-centric delivery approach',
      'Readily Available Resources - Immediate access to qualified professionals',
      'Competitive Pricing - Cost-effective service delivery',
    ],
    process: [
      {
        number: 1,
        title: 'Identify Opportunity',
        description: 'Recognize Professional Services opportunity',
      },
      {
        number: 2,
        title: 'Contact Channel Team',
        description:
          'Reach out to Netpoleon Channel Team for qualification and consultation',
      },
      {
        number: 3,
        title: 'Define Solution',
        description:
          'Determine solution to be delivered and agree on scope to be quoted',
      },
      {
        number: 4,
        title: 'Release Purchase Order',
        description: 'Complete Purchase Order and sign Statement of Work (SoW)',
      },
      {
        number: 5,
        title: 'Project Kick-off',
        description: 'Initiate the project and define the schedule',
      },
      {
        number: 6,
        title: 'Project Completion',
        description: 'Sign off upon completion of the project',
      },
    ],
    ctaSection: {
      title: 'Achieve Your Security Objectives',
      description:
        'Ensure successful cybersecurity deployments with our certified professional services team.',
      primaryButton: 'Request Professional Services',
      secondaryButton: 'View Service Portfolio',
    },
  },
  ncircle: {
    id: 'ncircle',
    title: 'N.Circle - Support Services',
    categories: ['Support Services', 'Customer Success'],
    overview: [
      "Netpoleon's N.Circle service is how we contribute to the success of our vendor product deployments by providing the first line of support. We also ensure that our Partner's Customers maximize their investment into the technologies that they have entrusted to keep their information and enterprises safe by making sure they are aware of all functions and features they have access to.",
    ],
    whatsIncluded: [
      'Vendor Maintenance and Support Services - Comprehensive technical support',
      'Customer Success Management - Dedicated customer success initiatives',
      'Product Health Checks - Proactive technology assessments',
    ],
    keyBenefits: [
      'Local Support Resources - Local and within time zone support resources',
      'Direct Escalation Path - Direct escalation path to vendor Tier 2 support services',
      'Customer Stickiness - Develops Partner customer stickiness through success initiatives',
    ],
    process: [
      {
        number: 1,
        title: 'Support Information Delivery',
        description:
          'Support information sheet is sent out with invoice of procured products',
      },
      {
        number: 2,
        title: 'Strategic Outreach',
        description:
          'Customer Success team reaches out to Partners and Customers on a strategic basis',
      },
      {
        number: 3,
        title: 'Health Check Services',
        description:
          'Product Health Checks are offered as a service for existing Customers',
      },
    ],
    ctaSection: {
      title: 'Maximize Your Technology Investment',
      description:
        'Ensure optimal performance and success of your technology investments with our comprehensive support services.',
      primaryButton: 'Get Support Services',
      secondaryButton: 'View Support Options',
    },
  },
};

export function getServiceData(serviceId: string): ServiceData | null {
  return servicesData[serviceId] || null;
}

export function getAllServiceIds(): string[] {
  return Object.keys(servicesData);
}
