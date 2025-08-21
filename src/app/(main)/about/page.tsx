"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutUs() {
  const services = [
    {
      title: "Vendor Partner Management",
      icon: "🤝",
      desc: "Strategic cybersecurity vendor relationship management and partnership optimization",
      highlight: "Enterprise Focus",
    },
    {
      title: "Solution Architecture",
      icon: "🏗️",
      desc: "Custom security architecture design, planning, and implementation roadmaps",
      highlight: "Custom Design",
    },
    {
      title: "Implementation Services",
      icon: "⚙️",
      desc: "End-to-end deployment, integration, and configuration support",
      highlight: "Full Service",
    },
    {
      title: "Training & Certification",
      icon: "📚",
      desc: "Comprehensive security awareness and technical certification programs",
      highlight: "Expert Training",
    },
    {
      title: "Managed Security Services",
      icon: "🛡️",
      desc: "Continuous monitoring, management, and optimization of security solutions",
      highlight: "24/7 Monitoring",
    },
    {
      title: "Security Support",
      icon: "🚨",
      desc: "Round-the-clock incident response, troubleshooting, and technical support",
      highlight: "Always Available",
    },
  ]

  
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.section
        className="relative h-[500px] bg-gradient-to-br from-primary/10 via-background to-accent/5 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-[url('/placeholder-0g1r7.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center text-center">
          <motion.div className="space-y-6" variants={fadeInUp}>
            <div className="typewriter">
                <h1>Trusted Cybersecurity Partner Since 2018</h1>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              About <span className="text-primary">Netpoleon</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Leading cybersecurity value-added distributor, empowering organizations with cutting-edge security
              technologies and expert implementation services.
            </p>
            
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission Section */}
            <div className="space-y-6">
              {/* Mission Image Placeholder */}
              <motion.div className="bg-gray-300 rounded-lg h-48 flex items-center justify-center" variants={fadeInUp}>
                <div className="text-center text-gray-600">
                  <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm">Mission-focused image</p>
                </div>
              </motion.div>

              <motion.div className="bg-gray-50 p-8 rounded-lg" variants={fadeInUp}>
                <Badge variant="outline" className="text-primary border-primary">
                  Our Mission
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Democratizing Enterprise Cybersecurity
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To provide organizations of all sizes access to world-class security technologies, expert
                  implementation services, and ongoing support through our trusted distribution network.
                </p>
              </motion.div>
            </div>

            {/* Vision Section */}
            <div className="space-y-6">
              {/* Vision Image Placeholder */}
              <motion.div className="bg-gray-300 rounded-lg h-48 flex items-center justify-center" variants={fadeInUp}>
                <div className="text-center text-gray-600">
                  <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-sm">Vision-focused image</p>
                </div>
              </motion.div>

              <motion.div className="bg-gray-50 p-8 rounded-lg" variants={fadeInUp}>
                <Badge variant="outline" className="text-primary border-primary">
                  Our Vision
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">A More Secure Digital World</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To be the global leader in cybersecurity value-added distribution, creating a more secure digital
                  world by connecting innovative security vendors with organizations that need protection.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      

      <motion.section
        className="py-20 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp} className="space-y-4">
              <Badge variant="outline" className="text-primary border-primary">
                Our Journey
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Our Story</h2>
            </motion.div>
          </div>

          <motion.div className="space-y-12" variants={fadeIn}>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>

              {[
                {
                  year: "2018",
                  title: "Foundation",
                  desc: "Founded with the vision to democratize enterprise cybersecurity solutions for organizations of all sizes.",
                },
                {
                  year: "2020",
                  title: "Growth",
                  desc: "Expanded our vendor network to 50+ partners and established our first enterprise client relationships.",
                },
                {
                  year: "2022",
                  title: "Innovation",
                  desc: "Launched our managed security services division and achieved SOC 2 Type II certification.",
                },
                {
                  year: "2024",
                  title: "Leadership",
                  desc: "Now serving 200+ vendors and 500+ implementations, recognized as a leading cybersecurity VAD.",
                },
              ].map((milestone, index) => (
                <motion.div key={index} className="relative flex items-start space-x-8" variants={fadeInUp}>
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{milestone.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-card/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div variants={fadeInUp} className="space-y-4">
              <Badge variant="secondary" className="text-primary">
                What We Do
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Our Services</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive cybersecurity distribution and support services tailored to your organization's needs.
              </p>
            </motion.div>
          </div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="p-6 h-full border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{service.icon}</div>
                      <Badge variant="outline" className="text-xs">
                        {service.highlight}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-gradient-to-r from-primary to-accent text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div variants={fadeInUp} className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">Ready to Strengthen Your Security Posture?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Partner with Netpoleon to access enterprise-grade cybersecurity solutions and expert implementation
              services tailored to your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                View Our Solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
