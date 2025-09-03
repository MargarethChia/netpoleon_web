import HeroSection from '../components/HeroSection';
import ImageTextSection from '../components/ImageTextSection';
import VendorCarousel from '../components/VendorCarousel';
import Statistics from '../components/Statistics';
import NewsSection from '../components/CardsSection';
import GraphSection from '../components/GraphSection';

// import AboutSection from "../components/AboutSection";
// import InfoSection from "../components/InfoSection";

export default function Home() {
  // Home Page
  const hero = {
    title: 'Secure, defend, and thrive everywhere',
    subtitle:
      'We safeguard your data, systems, and networks with cutting-edge cybersecurity solutions. Our platform empowers businesses to stay resilient, compliant, and ready for the future.',
    primaryButtonText: 'Get Started Today',
    secondaryButtonText: 'Learn More',
    heroImage: '/images/hero/hero-main.jpg',
    heroImageAlt: 'Netpoleon - Innovative Technology Solutions',
  };

  console.log('Home page rendering with hero props:', hero);

  // const about = {
  //   title: "About Netpoleon",
  //   description:
  //     "We are a team of passionate innovators dedicated to helping businesses thrive in the digital age. Our mission is to deliver exceptional solutions that drive growth and create lasting impact.",
  // };

  const imageTextSections = [
    {
      title: 'Innovative Web Solutions',
      description:
        "We create cutting-edge web applications that help businesses scale and succeed in today's competitive market. Our team of experts delivers solutions that are both beautiful and functional.",
      imageSrc: '/images/web-development.jpg',
      imageAlt: 'Web Development',
      layout: 'left' as const,
      ctaText: 'Explore Our Work',
      ctaLink: '#',
    },
  ];

  const vendors = [
    { id: 1, name: 'Microsoft', logo: '/images/logos/logo-1.png' },
    { id: 2, name: 'Google', logo: '/images/logos/logo-2.png' },
    { id: 3, name: 'Amazon', logo: '/images/logos/logo-3.png' },
    { id: 4, name: 'Apple', logo: '/images/logos/logo-4.png' },
    { id: 5, name: 'Meta', logo: '/images/logos/logo-5.png' },
    { id: 6, name: 'Netflix', logo: '/images/logos/logo-6.png' },
  ];

  // const info = {
  //   title: "Why Choose Netpoleon?",
  //   points: [
  //     {
  //       id: 1,
  //       title: "Expert Team",
  //       description:
  //         "Our experienced developers and designers deliver exceptional results.",
  //     },
  //     {
  //       id: 2,
  //       title: "Quality Assurance",
  //       description:
  //         "Rigorous testing ensures your project meets the highest standards.",
  //     },
  //     {
  //       id: 3,
  //       title: "Ongoing Support",
  //       description:
  //         "We provide continuous support and maintenance for all our projects.",
  //     },
  //   ],
  //   image: "/images/why-choose-us.webp",
  //   imageAlt: "Netpoleon team working on innovative solutions",
  // };

  const news = {
    title: 'Latest News & Insights',
    subtitle: 'Stay updated with the latest trends and insights from our team',
    posts: [
      {
        id: 1,
        title:
          'Use Slack to make your SMB organisation more efficient and productive',
        excerpt:
          'Learn how Slack can help make your organisation more efficient and increase the impact of your sales, service and marketing teams.',
        type: 'On-demand',
        image: '/images/news/news-1.jpg',
      },
      {
        id: 2,
        title: 'Slack for HR, Onboarding and People & Culture teams',
        excerpt:
          "Join this interactive session to learn from Slack's Customer Success team how to create an exceptional onboarding experience for your new employees.",
        type: 'On-demand',
        image: '/images/news/news-2.jpg',
      },
      {
        id: 3,
        title: 'Workshop 101: Learn the basics',
        excerpt:
          'Learn the Slack basics and participate in interactive activities at this on-demand training session led by our customer success experts.',
        type: 'On-demand',
        image: '/images/news/news-3.webp',
      },
      {
        id: 4,
        title: 'What is Slack?',
        excerpt:
          'Discover the new ways of working that power business results with Slack.',
        type: 'On-demand',
        image: '/images/news/news-4.png',
      },
    ],
  };

  return (
    <div>
      <HeroSection {...hero} />
      <VendorCarousel
        title="Trusted by 10,000+ customers, from startup to enterprise "
        vendors={vendors}
      />
      {imageTextSections.map((section, idx) => (
        <ImageTextSection key={idx} {...section} />
      ))}
      <GraphSection />
      <Statistics />
      <NewsSection {...news} />
    </div>
  );
}
