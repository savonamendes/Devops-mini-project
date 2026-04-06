import { useState, useEffect } from 'react';
import HowToCard from '@/components/howtocard';
import HowToCardMobile from '@/components/howtocardmobile';

const ResponsiveHowToCard = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1280);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return <div className="py-16 bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100 min-h-[400px]" />;
    }

    return isMobile ? <HowToCardMobile /> : <HowToCard />;
};

export default ResponsiveHowToCard;
