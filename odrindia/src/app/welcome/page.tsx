"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import MobileWarning from "@/components/ui/MobileWarning"
import { shouldShowMobileWarning, dismissMobileWarning } from "@/hooks/useMobileDetection"

export default function WelcomePage() {
  const router = useRouter()
  const [particles, setParticles] = useState<any[]>([]);
  const [splashTimer, setSplashTimer] = useState(10)
  const [showMobileWarning, setShowMobileWarning] = useState(false)

  // Function to generate particles with consistent properties
  const generateParticles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      size: i < 25 ? 1 : 2,
    }));
  };

  // Only generate particles on client to avoid hydration mismatch
  useEffect(() => {
    setParticles(generateParticles(50)); // Generate 50 particles with consistent seed
  }, []);

  // Check for mobile device on welcome page too (as a backup)
  useEffect(() => {
    // Check if we need to show the mobile warning
    // This is a backup check since we already check in the root page
    if (shouldShowMobileWarning()) {
      setShowMobileWarning(true);
      // Pause the timer while showing the warning
      setSplashTimer(10);
    }
  }, []);
  
  const handleContinueAnyway = () => {
    dismissMobileWarning();
    setShowMobileWarning(false);
    // Reset timer when continuing
    setSplashTimer(10);
  };

  const handleDismiss = () => {
    setShowMobileWarning(false);
    // Reset timer when dismissing
    setSplashTimer(10);
  };

  useEffect(() => {
    // Only run the countdown if mobile warning is not shown
    if (!showMobileWarning && splashTimer > 0) {
      const timer = setTimeout(() => {
        setSplashTimer((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (!showMobileWarning && splashTimer === 0) {
      // Redirect to home page when timer ends
      router.push('/home')
    }
  }, [splashTimer, router, showMobileWarning])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#486581] to-[#b7a7a9] flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute bg-[#f6ece3] rounded-full animate-shimmer opacity-60 ${
              particle.size === 1 ? 'w-1 h-1' : 'w-2 h-2'
            }`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Splash Content */}
      <div className="text-center z-10">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse p-2">
            <Image
              src="/Logobg.svg"
              alt="ODR Lab Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">ODR LAB</h1>
          <p className="text-[#f6ece3] text-lg mb-2">A virtual space for student innovators and legal-tech enthusiasts to co-create smarter ODR systems—driven by expert guidance and AI.</p>
        </div>

        {/* Countdown Timer */}
        <div className="relative flex flex-col items-center">
          <div className="w-20 h-20 mb-4 relative">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" stroke="#f6ece3" strokeWidth="4" fill="none" opacity="0.3" />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#f6ece3"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (splashTimer / 10)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white w-10 text-center tabular-nums">{splashTimer}</span>
            </div>
          </div>
          <p className="text-[#f6ece3] text-sm">Preparing your experience...</p>
          
          {/* Skip button for users who don't want to wait */}
          <button 
            onClick={() => router.push('/home')}
            className="mt-6 text-[#f6ece3] text-sm underline hover:text-white transition-colors duration-300"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Mobile Warning Component */}
      <MobileWarning
        isOpen={showMobileWarning}
        onClose={handleDismiss}
        onContinue={handleContinueAnyway}
      />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
