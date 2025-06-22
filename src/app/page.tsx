import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ImageTextSection from "./components/ImageTextSection";
import VendorCarousel from "./components/VendorCarousel";
import StatisticsSection from "./components/StatisticsSection";
import InfoSection from "./components/InfoSection";
import NewsSection from "./components/CardsSection";
import Footer from "./components/Footer";

export default function Home() {
  // Content data for each section
  const hero = {
    title: "Welcome to Netpoleon",
    subtitle:
      "Empowering businesses with innovative solutions and cutting-edge technology. We help companies transform their digital presence and achieve remarkable growth.",
    primaryButtonText: "Get Started Today",
    secondaryButtonText: "Learn More",
    heroImage: "/images/hero/hero-main.jpg",
    heroImageAlt: "Netpoleon - Innovative Technology Solutions",
  };

  const about = {
    title: "About Netpoleon",
    description:
      "We are a team of passionate innovators dedicated to helping businesses thrive in the digital age. Our mission is to deliver exceptional solutions that drive growth and create lasting impact.",
  };

  const imageTextSections = [
    {
      title: "Innovative Web Solutions",
      description:
        "We create cutting-edge web applications that help businesses scale and succeed in today's competitive market. Our team of experts delivers solutions that are both beautiful and functional.",
      imageSrc: "/images/web-development.jpg",
      imageAlt: "Web Development",
      layout: "left" as const,
      ctaText: "Explore Our Work",
      ctaLink: "#",
    },
    {
      title: "Mobile App Development",
      description:
        "Transform your business with custom mobile applications that engage users and drive results. We build apps for iOS and Android that deliver exceptional user experiences.",
      imageSrc: "/images/mobile-development.jpg",
      imageAlt: "Mobile Development",
      layout: "right" as const,
      ctaText: "View Portfolio",
      ctaLink: "#",
    },
    {
      title: "Cloud Infrastructure",
      description:
        "Leverage the power of cloud computing with our scalable infrastructure solutions. We help businesses optimize their operations and reduce costs with modern cloud technologies.",
      imageSrc: "/images/cloud-solutions.jpg",
      imageAlt: "Cloud Solutions",
      layout: "left" as const,
      ctaText: "Learn More",
      ctaLink: "#",
    },
  ];

  const vendors = [
    { id: 1, name: "Microsoft", logo: "/images/logos/logo-1.png" },
    { id: 2, name: "Google", logo: "/images/logos/logo-2.png" },
    { id: 3, name: "Amazon", logo: "/images/logos/logo-3.png" },
    { id: 4, name: "Apple", logo: "/images/logos/logo-4.png" },
    { id: 5, name: "Meta", logo: "/images/logos/logo-5.png" },
    { id: 6, name: "Netflix", logo: "/images/logos/logo-6.png" },
  ];

  const statistics = [
    { 
      id: 1, 
      value: "500+", 
      label: "Projects Completed",
      excerpt: "Successfully delivered innovative solutions across various industries and technologies."
    },
    { 
      id: 2, 
      value: "99%", 
      label: "Client Satisfaction",
      excerpt: "Maintaining exceptional quality standards and exceeding client expectations consistently."
    },
    { 
      id: 3, 
      value: "24/7", 
      label: "Support Available",
      excerpt: "Round-the-clock technical support and maintenance for all our client projects."
    },
  ];

  const info = {
    title: "Why Choose Netpoleon?",
    points: [
      {
        id: 1,
        title: "Expert Team",
        description: "Our experienced developers and designers deliver exceptional results.",
      },
      {
        id: 2,
        title: "Quality Assurance",
        description: "Rigorous testing ensures your project meets the highest standards.",
      },
      {
        id: 3,
        title: "Ongoing Support",
        description: "We provide continuous support and maintenance for all our projects.",
      },
    ],
    image: "/images/why-choose-us.webp",
    imageAlt: "Netpoleon team working on innovative solutions",
  };

  const news = {
    title: "Latest News & Insights",
    subtitle: "Stay updated with the latest trends and insights from our team",
    posts: [
      {
        id: 1,
        title: "Use Slack to make your SMB organisation more efficient and productive",
        excerpt: "Learn how Slack can help make your organisation more efficient and increase the impact of your sales, service and marketing teams.",
        type: "On-demand",
        image: "/images/news/news-1.jpg"
      },
      {
        id: 2,
        title: "Slack for HR, Onboarding and People & Culture teams",
        excerpt: "Join this interactive session to learn from Slack's Customer Success team how to create an exceptional onboarding experience for your new employees.",
        type: "On-demand",
        image: "/images/news/news-2.jpg"
      },
      {
        id: 3,
        title: "Workshop 101: Learn the basics",
        excerpt: "Learn the Slack basics and participate in interactive activities at this on-demand training session led by our customer success experts.",
        type: "On-demand",
        image: "/images/news/news-3.webp"
      },
      {
        id: 4,
        title: "What is Slack?",
        excerpt: "Discover the new ways of working that power business results with Slack.",
        type: "On-demand",
        image: "/images/news/news-4.png"
      }
    ],
  };

  return (
    <div className="min-h-screen">
      <HeroSection {...hero} />
      <AboutSection {...about} />
      {imageTextSections.map((section, idx) => (
        <ImageTextSection key={idx} {...section} />
      ))}
      <VendorCarousel
        title="Trusted by Industry Leaders"
        subtitle="We work with companies of all sizes to deliver exceptional results"
        vendors={vendors}
      />
      <StatisticsSection statistics={statistics} />
      <InfoSection {...info} />
      <NewsSection {...news} />
      <Footer />
    </div>
  );
}
