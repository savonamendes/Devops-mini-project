"use client"

import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'website' | 'email' | 'huggingface';
  url: string;
}

export interface StudentAmbassador {
  name: string;
  image: string;
  institution: string;
  description: string;
  responsibility: string;
  socialLinks: SocialLink[];
}

interface StudentAmbassadorCardProps {
  ambassador: StudentAmbassador;
  index: number;
}

const platformIcons = {
  github: <FaGithub className="h-5 w-5" />,
  linkedin: <FaLinkedin className="h-5 w-5" />,
  twitter: <FaTwitter className="h-5 w-5" />,
  website: <FaGlobe className="h-5 w-5" />,
  email: <MdEmail className="h-5 w-5" />,
  huggingface: <SiHuggingface className="h-5 w-5" />
};

const platformColors = {
  github: "hover:text-gray-800",
  linkedin: "hover:text-blue-600",
  twitter: "hover:text-blue-400",
  website: "hover:text-green-600",
  email: "hover:text-red-500",
  huggingface: "hover:text-yellow-500"
};

export default function StudentAmbassadorCard({ ambassador, index }: StudentAmbassadorCardProps) {
  const animationDelay = 0.1 * index;
  
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: animationDelay }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Card className="overflow-hidden border-none shadow-lg h-full flex flex-col group max-w-sm mx-auto">
          {/* Image Container with Responsibility Badge */}
          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image 
                src={ambassador.image}
                alt={ambassador.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <Badge className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-xs">
              {ambassador.responsibility}
            </Badge>
          </div>
          
          <CardHeader className="bg-white pb-2 relative z-10 px-4 py-3">
            <CardTitle className="text-[#0a1e42] text-lg lg:text-xl">{ambassador.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">{ambassador.institution}</CardDescription>
          </CardHeader>
          
          <CardContent className="bg-white flex-grow px-4 pb-4">
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
              {ambassador.description}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2 pt-2 mt-auto">
              {ambassador.socialLinks.map((link, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-gray-500 transition-colors duration-200 ${platformColors[link.platform]} hover:scale-110 transform`}
                      aria-label={`${ambassador.name}'s ${link.platform}`}
                    >
                      <div className="w-4 h-4 lg:w-5 lg:h-5">
                        {platformIcons[link.platform]}
                      </div>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
