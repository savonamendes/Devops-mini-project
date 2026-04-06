"use client"

import Image from "next/image"
import { Award, ArrowRight, Clock, Globe, Target, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StudentAmbassadorSection from "@/components/about/StudentAmbassadorSection"


export default function AboutPage() {
  return (
    <div className="max-w-[100vw] overflow-x-hidden">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 ">
          {/* Hero Section */}
          <section
            className="relative bg-gradient-to-r from-[#0a1e42] to-[#263e69] py-20 text-white"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute right-0 top-0 w-60 h-60 bg-blue-400/10 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/4"></div>
              <div className="absolute left-0 bottom-0 w-60 h-60 bg-sky-400/10 rounded-full blur-xl transform -translate-x-1/3 translate-y-1/4"></div>
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center">
                <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                  About <span className="text-sky-400">ODR</span> Lab
                </h1>
                <div className="w-20 h-1 bg-sky-400 mx-auto rounded-full my-6"></div>
                <p className="mx-auto mt-4 max-w-[800px] text-lg text-blue-100 md:text-xl">
                  Aspire, Build and Connect with a global community of innovators to design and develop Online Dispute Resolution (ODR) systems.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="bg-gradient-to-b from-sky-50 to-white py-16 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Our Story</h2>
                <div className="w-20 h-1 bg-sky-400 mx-auto rounded-full mb-6"></div>
                <p className="mx-[10%] text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed text-justify">
                  ODR Lab was born from a shared vision among industry experts, passionate students, and forward-thinking academicians. It serves as a dynamic platform that bridges the gap between academia and industry, empowering innovators to connect with a global community around the design and development of Online Dispute Resolution (ODR) systems. Fueled by the eagerness of students to work on real-world challenges, the pressing societal need for more efficient justice mechanisms, and the collaborative spirit of global idea exchange, ODR Lab stands as a hub for innovation, dialogue, and impactful solutions.
                </p>
              </div>
            </div>
          </section>
          {/* Mission & Vision */}
          <section className="py-20 bg-gradient-to-b from-white via-sky-50 to-indigo-100/60 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-[#0a1e42] md:text-4xl mb-2 animate-fade-in">Our Purpose</h2>
                <div className="w-20 h-1 bg-sky-400 mx-auto rounded-full"></div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 max-w-full mx-[10%]">
                <Card className="flex-1 border border-blue-100 bg-gray-50 text-[#0a1e42] shadow-md transform transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="mb-3 w-fit rounded-full bg-blue-100 p-3">
                      <Target className="h-7 w-7 text-[#0a1e42]" />
                    </div>
                    <CardTitle className="text-2xl text-[#0a1e42]">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      ODR Lab&apos;s mission is to foster a global network of legal tech innovators and thought leaders committed to designing Online Dispute Resolution, Prevention and Management Systems adapted to specific contexts and cases—making such ODR systems more accessible, effective, and inclusive.
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex-1 border border-blue-100 bg-gray-50 text-[#0a1e42] shadow-md transform transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="mb-3 w-fit rounded-full bg-blue-100 p-3">
                      <Zap className="h-7 w-7 text-[#0a1e42]" />
                    </div>
                    <CardTitle className="text-2xl text-[#0a1e42]">Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      To build a global, inclusive platform that brings together innovators, mentors, academia, and technologists to collaboratively research and design innovative, technology-driven dispute resolution systems that are accessible to all.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fadeIn 1s ease-out;
            }
          `}</style>
          </section>

          {/* Student Ambassadors Section */}
          <StudentAmbassadorSection />
          {/* Values */}
          <section className="bg-gradient-to-r from-[#0a1e42] to-[#263e69] py-16 text-white">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="mb-2 text-3xl font-bold md:text-4xl">Core Values of Dispute Design Systems</h2>
                <div className="w-20 h-1 bg-sky-400 mx-auto rounded-full"></div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: <Users className="h-8 w-8" />, title: "Accessibility", description: "Making dispute resolution system accessible to all" },
                  { icon: <Globe className="h-8 w-8" />, title: "Innovation", description: "Innovating ODR Systems through Technology Integration " },
                  { icon: <Award className="h-8 w-8" />, title: "Integrity", description: "Upholding the highest ethical standards" },
                  { icon: <Target className="h-8 w-8" />, title: "Efficiency", description: "Delivering timely and effective solutions" },
                  { icon: <Zap className="h-8 w-8" />, title: "Empathy", description: "Understanding the human aspects of disputes" },
                  { icon: <Clock className="h-8 w-8" />, title: "Persistence", description: "Committed to finding resolutions" },
                ].map((value, i) => (
                  <div key={i} className="flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
                    <div className="mb-4 rounded-full bg-sky-500/20 backdrop-blur-sm p-4 border border-sky-400/30">
                      {value.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-sky-100">{value.title}</h3>
                    <p className="text-blue-100">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-blue-50 py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl rounded-lg bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg border border-blue-100">
                <div className="text-center">
                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Join Our Mission</h2>
                  <p className="mb-8 text-gray-600">
                    Whether you&apos;re a Legal Professional, Tech Enthusiast, ODR Expert, Conflict Resolution Professional, Student, Innovation Enthusiast, Academic Institution, or Organization seeking to be part of the ODR community and co-create ODR systems through collaborative efforts, we invite you to connect with us.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button className="bg-[#0a1e42] hover:bg-[#263e69] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <a href="/contact" className="flex items-center">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
