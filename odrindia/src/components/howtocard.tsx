import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { User, Lightbulb, Link2, Star } from 'lucide-react';
import Image from 'next/image';
const HowToCard: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const scrollTop = window.scrollY;
            const elementRect = sectionRef.current.getBoundingClientRect();
            const elementBottom = scrollTop + (elementRect.bottom / 4);

            // Simple calculation: 0% at top of page, 100% when element bottom exits viewport
            const progress = Math.min(100, Math.max(0, (scrollTop / elementBottom) * 100));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once to set initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section ref={sectionRef} className="py-16 bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100 howto-timeline-section">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-[#0a1e42] mb-4 sm:text-5xl md:text-6xl">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
                            How to use ODR LAB
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl">Follow these simple steps to get started with our collaborative platform</p>
                    <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
                </div>

                {/* Timeline Container */}
                <div className="relative mx-auto">
                    {/* Main Timeline Line - Base line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent transform -translate-y-1/2 z-0 rounded-full"></div>

                    {/* Scroll Progress Line - Simple fill animation */}
                    <div
                        className="absolute top-1/2 left-0 h-1 transform -translate-y-1/2 z-10 rounded-full transition-all duration-100 ease-out"
                        style={{
                            width: `${scrollProgress}%`,
                            background: 'linear-gradient(90deg, #3a86ff 0%, #6366f1 50%, #8b5cf6 100%)'
                        }}
                    >
                    </div>

                    {/* Timeline Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 relative z-20">
                        {/* Step 1 */}
                        <div className={`relative transition-all duration-700 ${scrollProgress >= 5 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            {/* Card */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-[1.5vw] md:p-[2vw] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group h-[20vh] sm:h-[10vw] md:h-[15vw] lg:h-[20vw] w-[15vw] m-auto flex flex-col">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>

                                {/* Step Number */}
                                <div className="absolute -top-[2vw] left-1/2 transform -translate-x-1/2 flex h-[3vw] w-[3vw] items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-[1.2vw]">
                                    1
                                </div>

                                <div className="flex flex-col items-center text-center py-[2vw] flex-1 justify-center">
                                    <div className="mb-[1.5vw] p-[1vw] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <User color="#3a86ff" strokeWidth={3} size={40} />
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-2 text-sm sm:text-base md:text-[1.2vw]">Sign Up</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-[0.9vw] leading-relaxed">Register as an Innovator</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className={`relative transition-all duration-700 delay-150 ${scrollProgress >= 20 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-[1.5vw] md:p-[2vw] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group h-[20vh] sm:h-[10vw] md:h-[15vw] lg:h-[20vw] w-[15vw] m-auto flex flex-col">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>

                                <div className="absolute -top-[2vw] left-1/2 transform -translate-x-1/2 flex h-[3vw] w-[3vw] items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-[1.2vw]">
                                    2
                                </div>

                                <div className="flex flex-col items-center text-center py-[2vw] flex-1 justify-center">
                                    <div className="mb-[1.5vw] p-[1vw] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <Lightbulb color="#3a86ff" strokeWidth={3} size={40} />
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-2 text-sm sm:text-base md:text-[1.2vw]">Join</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-[0.9vw] leading-relaxed">Start with an Idea Board to design ODR</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className={`relative transition-all duration-700 delay-300 ${scrollProgress >= 40 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-[1.5vw] md:p-[2vw] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group h-[20vh] sm:h-[10vw] md:h-[15vw] lg:h-[20vw] w-[15vw] m-auto flex flex-col">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>

                                <div className="absolute -top-[2vw] left-1/2 transform -translate-x-1/2 flex h-[3vw] w-[3vw] items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-[1.2vw]">
                                    3
                                </div>

                                <div className="flex flex-col items-center text-center py-[2vw] flex-1 justify-center">
                                    <div className="mb-[1.5vw] p-[1vw] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">

                                        <Image src="/discuss.svg" alt="Discuss Icon" width={50} height={50} />

                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-2 text-sm sm:text-base md:text-[1.2vw]">Discuss</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-[0.9vw] leading-relaxed">Deliberate and exchange ideas in the ODR Lab</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className={`relative transition-all duration-700 delay-500 ${scrollProgress >= 60 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-[1.5vw] md:p-[2vw] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group h-[20vh] sm:h-[10vw] md:h-[15vw] lg:h-[20vw] w-[15vw] m-auto flex flex-col">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>

                                <div className="absolute -top-[2vw] left-1/2 transform -translate-x-1/2 flex h-[3vw] w-[3vw] items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-[1.2vw]">
                                    4
                                </div>

                                <div className="flex flex-col items-center text-center py-[2vw] flex-1 justify-center">
                                    <div className="mb-[1.5vw] p-[1vw] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <Link2 color="#3a86ff" strokeWidth={3} size={40} />
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-2 text-sm sm:text-base md:text-[1.2vw]">Connect</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-[0.9vw] leading-relaxed">Engage with mentors and the AI chatbot</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className={`relative transition-all duration-700 delay-700 ${scrollProgress >= 80 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-[1.5vw] md:p-[2vw] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group h-[20vh] sm:h-[10vw] md:h-[15vw] lg:h-[20vw] w-[15vw] m-auto flex flex-col">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>

                                <div className="absolute -top-[2vw] left-1/2 transform -translate-x-1/2 flex h-[3vw] w-[3vw] items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-[1.2vw]">
                                    5
                                </div>

                                <div className="flex flex-col items-center text-center py-[2vw] flex-1 justify-center">
                                    <div className="mb-[1.5vw] p-[1vw] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <Star color="#3a86ff" strokeWidth={3} size={40} />
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-2 text-sm sm:text-base md:text-[1.2vw]">Reflect</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm md:text-[0.9vw] leading-relaxed">Collaboratively develop Impactful ODR Systems</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <Button className="bg-[#0a1e42] hover:bg-[#152a4e] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3 text-lg sm:text-xl"
                        onClick={() => window.location.href = '/submit-idea'}
                    >
                        Get Started Now
                    </Button>
                </div>

                {/* Enhanced CSS for dramatic timeline animations */}
                <style jsx>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%) skewX(-12deg);
                        }
                        100% {
                            transform: translateX(200%) skewX(-12deg);
                        }
                    }
                    
                    .animate-shimmer {
                        animation: shimmer 3s ease-in-out infinite;
                    }
                    
                    @keyframes ping {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        75%, 100% {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `}</style>
            </div>
        </section>
    );
};

export default HowToCard;