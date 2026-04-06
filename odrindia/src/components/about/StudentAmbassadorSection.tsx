"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import StudentAmbassadorCard, { StudentAmbassador } from "./StudentAmbassadorCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Data for student ambassadors
const ambassadors: StudentAmbassador[] = [
  {
    name: "Vanessa Rodrigues",
    image: "/vanessa.jpg",
    institution: "Second Year Computer Engineering Student, Fr. Conceicao Rodrigues College of Engineering",
    description: "Contributing to the development and innovation of ODR solutions. Specializing in Fullstack Webdevelopment and Software Development for dispute resolution systems.",
    responsibility: "Tech Lead",
    socialLinks: [
      { platform: "github", url: "https://github.com/Vanessa-Rodrigues-156" },
      { platform: "linkedin", url: "www.linkedin.com/in/vanessa-rodrigues-156vfr" },
      { platform: "email", url: "mailto:vanessarodrigues010506@gmail.com" }
    ]
  },
  {
    name: "Anjali Singh",
    image: "/anjali.png",
    institution: "Bachelor of Science in Information Technology Student, SVKM's Usha Pravin Gandhi College",
    description: "Focusing on AI/ML applications in ODR systems. Developing intelligent algorithms to enhance dispute resolution processes and improve user experience.",
    responsibility: "AI/ML Lead",
    socialLinks: [
      { platform: "huggingface", url: "https://huggingface.co/AnjaliSingh24" },
      { platform: "linkedin", url: "http://linkedin.com/in/anjali-singh-066191218" },
      { platform: "email", url: "mailto:anjalisingh24506@gmail.com" }
    ]
  },
  {
    name:"Aastha Bhatia",
    image: "/aastha.jpg",
    institution: "Communication Skills Professor, Fr. Conceicao Rodrigues College of Engineering",
    description: "Specializing in communication strategies for effective dispute resolution. Contributing as a Communication Skills expert and Soft Skills Enthusiast.",
    responsibility: "Communication",
    socialLinks: [
      {platform:"linkedin", url: "https://www.linkedin.com/in/aastha-bhatia-a95b86244/"},
      { platform: "email", url: "mailto:aasthabhatia24506@gmail.com" }
    ]
  }
];

export default function StudentAmbassadorSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResponsibility, setFilterResponsibility] = useState<string | null>(null);

  // Get unique responsibilities for filter buttons
  const uniqueResponsibilities = [...new Set(ambassadors.map(a => a.responsibility))];

  // Filter ambassadors based on search and responsibility
  const filteredAmbassadors = ambassadors.filter(ambassador => {
    const matchesSearch = ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassador.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassador.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterResponsibility === null || ambassador.responsibility === filterResponsibility;

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-24 bg-gradient-to-b from-indigo-100/60 to-blue-50 ">
      <div className="container mx-auto px-4">
        <div className="mx-[10%]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-[#0a1e42] md:text-4xl mb-2 animate-fade-in">Development and Communication Team </h2>
                <div className="w-20 h-1 bg-sky-400 mx-auto rounded-full"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  A dedicated team behind the development of  ODRLab.com to advance its mission
                </p>
              </div>
          </motion.div>

          {/* Search and filter */}
          <div className="mb-10 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search Team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={filterResponsibility === null ? "default" : "outline"}
                onClick={() => setFilterResponsibility(null)}
                className="transition-all"
              >
                All
              </Button>

              {uniqueResponsibilities.map((responsibility) => (
                <Button
                  key={responsibility}
                  variant={filterResponsibility === responsibility ? "default" : "outline"}
                  onClick={() => setFilterResponsibility(responsibility)}
                  className="transition-all"
                >
                  {responsibility}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-center mx-auto">
            {filteredAmbassadors.map((ambassador, index) => (
              <StudentAmbassadorCard
                key={ambassador.name}
                ambassador={ambassador}
                index={index}
              />
            ))}
          </div>

          {filteredAmbassadors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No ambassadors match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
