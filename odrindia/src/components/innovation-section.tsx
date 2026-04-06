"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

export function InnovationSection() {
  return (
    <motion.section 
      className="py-16 bg-gradient-to-b from-sky-100 via-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="mb-4 text-3xl font-bold tracking-tight text-[#0a1e42] sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
              Contribute to the future of Online Dispute Resolution
            </span>
          </motion.h2>
          <motion.p 
            className="mx-auto max-w-[700px] text-xl text-gray-600 sm:text-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Open to Ideas
          </motion.p>
          <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
        </motion.div>

        <motion.div 
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="border-none bg-white/80 backdrop-blur-sm overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <CardContent className="space-y-6 pt-8 pb-8">
                <motion.p
                  className="text-gray-700 text-lg leading-relaxed sm:text-xl"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  We&apos;re constantly looking for innovative approaches to improve ODR. Share your ideas, research, or
                  technology to help us advance the field and make dispute resolution more accessible to all.
                </motion.p>
                <motion.ul 
                  className="ml-6 list-disc space-y-3 text-gray-600"
                  initial="hidden"
                  whileInView="visible"
                  variants={staggerContainer}
                  viewport={{ once: true }}
                >
                  {[
                    "Propose new ODR methodologies",
                    "Suggest technological improvements", 
                    "Share research findings",
                    "Collaborate on pilot projects"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={fadeInUp}
                      className="text-base sm:text-lg"
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    className="bg-[#0a1e42] hover:bg-[#152a4e] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                    onClick={() => window.location.href = '/submit-idea'}
                  >
                    Submit Your Idea
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
