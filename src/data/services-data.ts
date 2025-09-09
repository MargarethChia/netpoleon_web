export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface ServiceData {
  id: string;
  title: string;
  categories: string[];
  provider: string;
  duration: string;
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
  'cloud-migration': {
    id: 'cloud-migration',
    title: 'Cloud Migration Services',
    categories: ['IT Services', 'High Complexity'],
    provider: 'TechFlow Solutions',
    duration: '2-6 months',
    overview: [
      'Our comprehensive cloud migration service helps businesses transition from legacy on-premises infrastructure to modern cloud platforms. We ensure minimal downtime, maximum security, and optimal performance throughout the migration process.',
      'Our experienced team handles everything from initial assessment and planning to execution and post-migration support. We work with all major cloud providers including AWS, Azure, and Google Cloud Platform.',
    ],
    whatsIncluded: [
      'Pre-migration assessment and planning',
      'Data migration and synchronization',
      'Application modernization',
      'Security configuration and compliance',
      'Performance optimization',
      'Staff training and documentation',
      'Post-migration support',
    ],
    keyBenefits: [
      'Reduced infrastructure costs',
      'Improved scalability and flexibility',
      'Enhanced security and compliance',
      'Better disaster recovery capabilities',
      'Increased operational efficiency',
      'Access to advanced cloud services',
    ],
    process: [
      {
        number: 1,
        title: 'Assessment',
        description:
          'Comprehensive evaluation of current infrastructure and requirements',
      },
      {
        number: 2,
        title: 'Planning',
        description: 'Detailed migration strategy and timeline development',
      },
      {
        number: 3,
        title: 'Preparation',
        description: 'Environment setup and security configuration',
      },
      {
        number: 4,
        title: 'Migration',
        description: 'Phased migration execution with minimal downtime',
      },
      {
        number: 5,
        title: 'Optimization',
        description: 'Performance tuning and cost optimization',
      },
      {
        number: 6,
        title: 'Support',
        description: 'Ongoing monitoring and support services',
      },
    ],
    ctaSection: {
      title: 'Ready to Get Started?',
      description:
        'Contact us to discuss your specific requirements and get a customized quote for this service.',
      primaryButton: 'Request Consultation',
      secondaryButton: 'View Provider Profile',
    },
  },
  'cybersecurity-assessment': {
    id: 'cybersecurity-assessment',
    title: 'Cybersecurity Assessment Services',
    categories: ['Security', 'Medium Complexity'],
    provider: 'SecureNet Experts',
    duration: '2-4 weeks',
    overview: [
      'Comprehensive cybersecurity assessment to identify vulnerabilities and strengthen your security posture. Our expert team conducts thorough evaluations of your infrastructure, applications, and security policies.',
      'We provide detailed reports with actionable recommendations to improve your organization&apos;s security resilience and compliance with industry standards.',
    ],
    whatsIncluded: [
      'Network security assessment',
      'Application security testing',
      'Vulnerability scanning',
      'Penetration testing',
      'Security policy review',
      'Compliance assessment',
      'Risk analysis and reporting',
    ],
    keyBenefits: [
      'Identify security vulnerabilities',
      'Improve compliance posture',
      'Reduce security risks',
      'Enhanced incident response',
      'Better security awareness',
    ],
    ctaSection: {
      title: 'Secure Your Organization',
      description:
        'Get a comprehensive security assessment to protect your business from cyber threats.',
      primaryButton: 'Schedule Assessment',
      secondaryButton: 'Learn More',
    },
  },
  'managed-security': {
    id: 'managed-security',
    title: 'Managed Security Services',
    categories: ['Security', 'Ongoing Service'],
    provider: 'CyberGuard Solutions',
    duration: 'Ongoing',
    overview: [
      '24/7 managed security services providing continuous monitoring, threat detection, and incident response for your organization.',
      'Our Security Operations Center (SOC) team uses advanced tools and expertise to protect your business around the clock.',
    ],
    whatsIncluded: [
      '24/7 security monitoring',
      'Threat detection and analysis',
      'Incident response',
      'Security event management',
      'Regular security reports',
      'Compliance monitoring',
    ],
    keyBenefits: [
      'Round-the-clock protection',
      'Expert security team',
      'Rapid incident response',
      'Cost-effective security',
      'Compliance assurance',
    ],
  },
  'channel-sales-enablement': {
    id: 'channel-sales-enablement',
    title: 'Channel Sales & Enablement',
    categories: ['Sales', 'Strategic Planning'],
    provider: 'Netpoleon Partner Network',
    duration: '3-6 months',
    overview: [
      'Comprehensive channel sales strategies and enablement programs to maximize your distribution network effectiveness.',
      'Our expert team helps you build, optimize, and scale your channel partner relationships for sustained growth and market expansion.',
    ],
    whatsIncluded: [
      'Channel strategy development',
      'Partner recruitment and onboarding',
      'Sales training and certification',
      'Marketing co-op programs',
      'Performance tracking and analytics',
      'Channel conflict resolution',
    ],
    keyBenefits: [
      'Increased market reach',
      'Improved partner performance',
      'Accelerated revenue growth',
      'Reduced sales cycle time',
      'Enhanced partner loyalty',
    ],
    ctaSection: {
      title: 'Scale Your Channel Network',
      description:
        'Transform your distribution strategy with our proven channel enablement programs.',
      primaryButton: 'Discuss Channel Strategy',
      secondaryButton: 'View Case Studies',
    },
  },
  'operations-logistics': {
    id: 'operations-logistics',
    title: 'Operations & Logistics Services',
    categories: ['Operations', 'Supply Chain'],
    provider: 'OptiFlow Systems',
    duration: '2-4 months',
    overview: [
      'End-to-end operational excellence and logistics solutions to streamline your business processes.',
      'We optimize your supply chain, improve operational efficiency, and reduce costs while maintaining high service levels.',
    ],
    whatsIncluded: [
      'Process optimization analysis',
      'Supply chain management',
      'Inventory optimization',
      'Logistics coordination',
      'Performance metrics implementation',
      'Continuous improvement programs',
    ],
    keyBenefits: [
      'Reduced operational costs',
      'Improved delivery times',
      'Enhanced process efficiency',
      'Better inventory management',
      'Increased customer satisfaction',
    ],
    ctaSection: {
      title: 'Optimize Your Operations',
      description:
        'Streamline your business processes and improve operational efficiency with our expert team.',
      primaryButton: 'Schedule Operations Review',
      secondaryButton: 'Learn More',
    },
  },
  'pre-sales-consultation': {
    id: 'pre-sales-consultation',
    title: 'Pre-Sales POV, Consultation & Professional Services',
    categories: ['Consulting', 'Strategic Planning'],
    provider: 'Strategic Solutions Group',
    duration: '1-3 months',
    overview: [
      'Strategic pre-sales consultation and professional services to enhance customer engagement and solution design.',
      'Our consultants work with your team to develop compelling value propositions and winning sales strategies.',
    ],
    whatsIncluded: [
      'Market analysis and positioning',
      'Solution architecture design',
      'Value proposition development',
      'Competitive analysis',
      'Sales presentation development',
      'Proposal writing support',
    ],
    keyBenefits: [
      'Higher win rates',
      'Shorter sales cycles',
      'Better qualified opportunities',
      'Improved customer engagement',
      'Enhanced solution differentiation',
    ],
    ctaSection: {
      title: 'Boost Your Sales Success',
      description:
        'Enhance your pre-sales capabilities with strategic consultation and professional services.',
      primaryButton: 'Get Sales Consultation',
      secondaryButton: 'View Success Stories',
    },
  },
  'post-sales-support': {
    id: 'post-sales-support',
    title: 'Post-Sales & Customer Support Services',
    categories: ['Support', 'Customer Success'],
    provider: 'CustomerFirst Solutions',
    duration: 'Ongoing',
    overview: [
      'Comprehensive post-sales support and customer service solutions to ensure long-term customer satisfaction.',
      'We help you build strong customer relationships through exceptional support experiences and proactive success management.',
    ],
    whatsIncluded: [
      '24/7 customer support',
      'Technical helpdesk services',
      'Customer success management',
      'Training and onboarding',
      'Issue escalation management',
      'Customer satisfaction monitoring',
    ],
    keyBenefits: [
      'Improved customer retention',
      'Higher customer satisfaction',
      'Reduced churn rates',
      'Increased upsell opportunities',
      'Enhanced brand reputation',
    ],
    ctaSection: {
      title: 'Enhance Customer Success',
      description:
        'Build lasting customer relationships with our comprehensive post-sales support services.',
      primaryButton: 'Improve Customer Support',
      secondaryButton: 'View Support Models',
    },
  },
  'technology-training': {
    id: 'technology-training',
    title: 'Technology & Product Training',
    categories: ['Training', 'Education'],
    provider: 'TechLearn Academy',
    duration: '1-2 months',
    overview: [
      'Specialized training programs for technology products and solutions to maximize user adoption and proficiency.',
      'Our certified instructors deliver comprehensive training that ensures your team can effectively leverage new technologies.',
    ],
    whatsIncluded: [
      'Customized training curriculum',
      'Hands-on lab exercises',
      'Certification programs',
      'Online learning platforms',
      'Progress tracking and assessment',
      'Ongoing support and resources',
    ],
    keyBenefits: [
      'Faster technology adoption',
      'Improved user proficiency',
      'Reduced support tickets',
      'Higher ROI on technology investments',
      'Enhanced team capabilities',
    ],
    ctaSection: {
      title: 'Empower Your Team',
      description:
        'Accelerate technology adoption with our comprehensive training and certification programs.',
      primaryButton: 'Plan Training Program',
      secondaryButton: 'Browse Courses',
    },
  },
  'vendor-promotion': {
    id: 'vendor-promotion',
    title: 'Vendor Promotion & Augmentation',
    categories: ['Marketing', 'Vendor Relations'],
    provider: 'PromoTech Partners',
    duration: '3-6 months',
    overview: [
      'Strategic vendor promotion and augmentation services to enhance market presence and operational capabilities.',
      'We help vendors increase their market visibility, expand their reach, and optimize their go-to-market strategies.',
    ],
    whatsIncluded: [
      'Market positioning strategy',
      'Brand promotion campaigns',
      'Partner recruitment',
      'Event marketing support',
      'Digital marketing initiatives',
      'Performance analytics and reporting',
    ],
    keyBenefits: [
      'Increased brand visibility',
      'Expanded market reach',
      'Enhanced partner relationships',
      'Improved market positioning',
      'Higher lead generation',
    ],
    ctaSection: {
      title: 'Amplify Your Market Presence',
      description:
        'Boost your vendor visibility and market impact with our strategic promotion services.',
      primaryButton: 'Expand Market Reach',
      secondaryButton: 'View Promotion Strategies',
    },
  },
  'marketing-business-development': {
    id: 'marketing-business-development',
    title: 'Marketing & Business Development Support',
    categories: ['Marketing', 'Business Development'],
    provider: 'GrowthMax Solutions',
    duration: '3-9 months',
    overview: [
      'Comprehensive marketing strategies and business development support to drive growth and market expansion.',
      'Our team combines strategic marketing expertise with business development acumen to accelerate your growth trajectory.',
    ],
    whatsIncluded: [
      'Marketing strategy development',
      'Lead generation campaigns',
      'Business development planning',
      'Partnership identification',
      'Market research and analysis',
      'Campaign performance optimization',
    ],
    keyBenefits: [
      'Accelerated business growth',
      'Improved market position',
      'Higher quality leads',
      'Enhanced brand recognition',
      'Expanded business opportunities',
    ],
    ctaSection: {
      title: 'Accelerate Your Growth',
      description:
        'Drive business expansion with our comprehensive marketing and business development support.',
      primaryButton: 'Plan Growth Strategy',
      secondaryButton: 'View Growth Solutions',
    },
  },
  'finance-services': {
    id: 'finance-services',
    title: 'Finance Services',
    categories: ['Finance', 'Consulting'],
    provider: 'FinanceFirst Advisory',
    duration: '2-6 months',
    overview: [
      'Professional financial services and consulting to optimize your business financial performance and strategy.',
      'Our financial experts help you streamline operations, improve cash flow, and make strategic financial decisions for sustainable growth.',
    ],
    whatsIncluded: [
      'Financial analysis and planning',
      'Cash flow optimization',
      'Investment strategy development',
      'Risk assessment and management',
      'Financial reporting systems',
      'Compliance and regulatory support',
    ],
    keyBenefits: [
      'Improved financial performance',
      'Better cash flow management',
      'Reduced financial risks',
      'Enhanced decision making',
      'Regulatory compliance assurance',
    ],
    ctaSection: {
      title: 'Optimize Your Finances',
      description:
        'Enhance your financial performance and strategic planning with our expert financial services.',
      primaryButton: 'Get Financial Review',
      secondaryButton: 'View Financial Solutions',
    },
  },
  'marketplace-solutions': {
    id: 'marketplace-solutions',
    title: 'Marketplace',
    categories: ['E-commerce', 'Platform Development'],
    provider: 'MarketPlace Pro',
    duration: '4-8 months',
    overview: [
      'Digital marketplace solutions and platforms to facilitate commerce and business transactions.',
      'We build and optimize digital marketplaces that connect buyers and sellers, streamline transactions, and drive business growth.',
    ],
    whatsIncluded: [
      'Marketplace platform development',
      'Payment system integration',
      'Vendor onboarding systems',
      'Order management workflows',
      'Analytics and reporting tools',
      'Mobile app development',
    ],
    keyBenefits: [
      'Expanded revenue streams',
      'Improved transaction efficiency',
      'Enhanced customer experience',
      'Scalable business model',
      'Competitive market advantage',
    ],
    ctaSection: {
      title: 'Build Your Marketplace',
      description:
        'Create a thriving digital marketplace that connects your business ecosystem and drives growth.',
      primaryButton: 'Start Marketplace Project',
      secondaryButton: 'View Marketplace Examples',
    },
  },
};

export function getServiceData(serviceId: string): ServiceData | null {
  return servicesData[serviceId] || null;
}

export function getAllServiceIds(): string[] {
  return Object.keys(servicesData);
}
