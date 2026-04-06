import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenWidth: number;
}

export function useMobileDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
    screenWidth: 1024
  });

  useEffect(() => {
    const detectDevice = () => {
      const screenWidth = window.innerWidth;
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check user agent for mobile devices
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      // Check screen width
      const isMobileWidth = screenWidth <= 768;
      const isTabletWidth = screenWidth > 768 && screenWidth <= 1024;
      const isDesktopWidth = screenWidth > 1024;
      
      // Determine device type
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = true;
      
      if (isMobileUA || isMobileWidth) {
        deviceType = 'mobile';
        isMobile = true;
        isTablet = false;
        isDesktop = false;
      } else if (isTabletWidth) {
        deviceType = 'tablet';
        isMobile = false;
        isTablet = true;
        isDesktop = false;
      }
      
      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        screenWidth
      });
    };

    // Initial detection
    detectDevice();

    // Listen for screen resize
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return detection;
}

// Utility function to check if user should see mobile warning
export function shouldShowMobileWarning(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hasSeenWarning = sessionStorage.getItem('mobile-warning-dismissed');
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  const isMobileWidth = window.innerWidth <= 768;
  
  return (isMobileUA || isMobileWidth) && !hasSeenWarning;
}

// Utility function to dismiss mobile warning
export function dismissMobileWarning(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('mobile-warning-dismissed', 'true');
  }
}
