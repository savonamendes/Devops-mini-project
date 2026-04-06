import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { User, Lightbulb, Link2, Star } from 'lucide-react';
import Image from 'next/image';

const HowToCardMobile: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const scrollTop = window.scrollY;
            const elementRect = sectionRef.current.getBoundingClientRect();
            const elementBottom = scrollTop + (elementRect.bottom / 4);
            
            const progress = Math.min(100, Math.max(0, (scrollTop / elementBottom) * 100));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            number: 1,
            title: "Sign Up",
            description: "Register as an Innovator",
            icon: <User color="#3a86ff" strokeWidth={3} size={40} />
        },
        {
            number: 2,
            title: "Join",
            description: "Start with an Idea Board to design ODR",
            icon: <Lightbulb color="#3a86ff" strokeWidth={3} size={40} />
        },
        {
            number: 3,
            title: "Discuss",
            description: "Deliberate and exchange ideas in the ODR Lab",
            icon: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Image src="/discuss.svg" alt="Discuss Icon" width={40} height={40} />
                </div>
            )
        },
        {
            number: 4,
            title: "Connect",
            description: "Engage with mentors and the AI chatbot",
            icon: <Link2 color="#3a86ff" strokeWidth={3} size={40} />
        },
        {
            number: 5,
            title: "Reflect",
            description: "Collaboratively develop Impactful ODR Systems",
            icon: <Star color="#3a86ff" strokeWidth={3} size={40} />
        }
    ];

    return (
        <section ref={sectionRef} className="py-12 bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-[#0a1e42] mb-3 sm:text-4xl">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
                            How to use ODR LAB
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
                        Follow these simple steps to get started with our collaborative platform
                    </p>
                    <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
                </div>

                {/* Mobile Timeline - Vertical Layout */}
                <div className="relative max-w-md mx-auto">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full"></div>
                    
                    {/* Progress Line */}
                    <div 
                        className="absolute left-8 top-0 w-0.5 rounded-full transition-all duration-300 ease-out z-10"
                        style={{
                            height: `${Math.min(scrollProgress * 2, 100)}%`,
                            background: 'linear-gradient(180deg, #3a86ff 0%, #6366f1 50%, #8b5cf6 100%)'
                        }}
                    />

                    {/* Steps */}
                    <div className="space-y-6 ">
                        {steps.map((step, index) => (
                            <div 
                                key={step.number}
                                className={`relative flex items-start transition-all duration-700 ${
                                    scrollProgress >= (index + 1) * 15 
                                        ? 'opacity-100 transform translate-x-0' 
                                        : 'opacity-70 transform translate-x-4'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Step Number Circle */}
                                <div className="relative z-20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-lg text-lg border-4 border-white">
                                    {step.number}
                                    {/* Pulse animation for active step */}
                                    {scrollProgress >= (index + 1) * 15 && (
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] animate-ping opacity-20"></div>
                                    )}
                                </div>

                                {/* Step Content Card */}
                                <div className="ml-4 flex-1 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
                                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
                                    
                                    <div className="flex items-start space-x-3">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                            <div className="text-[#3a86ff] group-hover:text-[#0a1e42] transition-colors duration-300">
                                                {step.icon}
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-[#0a1e42] font-bold text-lg mb-1 sm:text-xl">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed sm:text-base">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Button className="bg-[#0a1e42] hover:bg-[#152a4e] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3 text-base w-full sm:w-auto sm:text-lg"
                    onClick={() => window.location.href = '/submit-idea'}
                    >
                        Get Started Now
                    </Button>
                </div>

                {/* Mobile-specific CSS animations */}
                <style jsx>{`
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }
                    
                    @keyframes slideIn {
                        from {
                            transform: translateX(20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    
                    .animate-pulse {
                        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                    
                    .animate-slide-in {
                        animation: slideIn 0.5s ease-out forwards;
                    }
                `}</style>
            </div>
        </section>
    );
};

export default HowToCardMobile;
