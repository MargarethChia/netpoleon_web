import HeroSection from '../components/HeroSection';
import VendorCarousel from '../components/VendorCarousel';
//import Statistics from '../components/Statistics';
import LatestResources from '../components/LatestResources';
import GraphSection from '../components/GraphSection';
import Statistics from '../components/Statistics';

// import AboutSection from "../components/AboutSection";
// import InfoSection from "../components/InfoSection";

export default function Home() {
  // Home Page
  const hero = {
    title: "MAKING CYBER\nEVERYONE'S BUSINESS",
    subtitle:
      'Leading the way into the next generation of cyber security solutions',
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

  // const imageTextSections = [
  //   {
  //     title: 'Innovative Web Solutions',
  //     description:
  //       "We create cutting-edge web applications that help businesses scale and succeed in today's competitive market. Our team of experts delivers solutions that are both beautiful and functional.",
  //     imageSrc: '/images/web-development.jpg',
  //     imageAlt: 'Web Development',
  //     layout: 'left' as const,
  //     ctaText: 'Explore Our Work',
  //     ctaLink: '#',
  //   },
  // ];

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

  return (
    <div>
      <HeroSection {...hero} />
      <VendorCarousel title="Trusted by 10,000+ customers, from startup to enterprise " />
      <GraphSection />
      <Statistics />

      {/*
      {imageTextSections.map((section, idx) => (
        <ImageTextSection key={idx} {...section} />
      ))}
      */}

      <LatestResources />
    </div>
  );
}
