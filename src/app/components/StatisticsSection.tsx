'use client';

import { motion } from "framer-motion";

interface Statistic {
  id: number;
  value: string;
  label: string;
  excerpt: string;
}

interface StatisticsSectionProps {
  statistics: Statistic[];
}

export default function StatisticsSection({ statistics }: StatisticsSectionProps) {
  return (
    <section className="py-16 lg:min-h-[60vh] lg:flex lg:items-center bg-gradient-to-br from-primary to-orange-600 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {statistics.map((stat, index) => (
            <motion.div 
              key={stat.id} 
              className="space-y-4 transform hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-white">{stat.label}</div>
              <div className="text-white/80 leading-relaxed">
                {stat.excerpt}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 