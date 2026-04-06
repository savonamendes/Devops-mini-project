"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative bg-[#0a1e42] py-20 text-white overflow-hidden"
      style={{
        backgroundImage: "url('/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background animation elements */}
      <motion.div 
        className="absolute top-20 right-10 w-60 h-60 rounded-full bg-[#3a86ff]/10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-sky-400/10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
      <div className="container relative z-10">
        <div className="grid gap-8 md:grid-cols-[60%,40%] md:gap-12">
          <motion.div 
            className="flex flex-col justify-center space-y-6 pl-[5vw]"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              variants={fadeInUp}
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="text-[#3a86ff]">A</span><span className="text-white">spire</span>, {" "}
                <span className="text-[#3a86ff]">B</span><span className="text-white">uild</span> {" "}
                <span className="text-sky-100">and</span> {" "}
                <span className="text-[#3a86ff]">C</span><span className="text-white">onnect</span>
              </motion.span>
            </motion.h1>
            <motion.p 
              className="max-w-[600px] text-lg text-sky-100 sm:text-xl md:text-2xl"
              variants={fadeInUp}
            >
              Join a community of changemakers building the next wave of ODR systems and legal tech solutions
            </motion.p>
            <motion.div 
              className="flex flex-col gap-4 sm:flex-row"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="bg-[#3a86ff] hover:bg-[#3a86ff]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                onClick={() => window.location.href = '/signup'}
              >
                Register as an Innovator or Mentor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
