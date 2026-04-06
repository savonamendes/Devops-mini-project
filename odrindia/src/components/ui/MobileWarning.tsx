"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  title?: string;
  message?: string;
  showSwitchButton?: boolean;
}

export default function MobileWarning({
  isOpen,
  onClose,
  onContinue,
  title = "Better Experience on Desktop",
  message = "ODR Lab is optimized for desktop use. For the best experience with our features like collaborative editing and video meetings, we recommend using a desktop or laptop computer.",
  showSwitchButton = true
}: MobileWarningProps) {
  const handleSwitchToDesktop = () => {
    // Try to close the current tab/window
    if (window.opener) {
      window.close();
    } else {
      // If can't close, show an alert
      alert("Please switch to a desktop or laptop computer for the best experience.");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="relative">
                  <Monitor className="h-8 w-8 text-blue-600" />
                  <div className="absolute -bottom-1 -right-1 bg-orange-100 rounded-full p-1">
                    <Smartphone className="h-3 w-3 text-orange-600" />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {message}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={onContinue}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Continue on Mobile
                </Button>
                
                {showSwitchButton && (
                  <Button
                    variant="outline"
                    onClick={handleSwitchToDesktop}
                    className="w-full text-gray-600 hover:text-gray-800"
                  >
                    Switch to Desktop
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                This message won&apos;t appear again during this session.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simplified version for inline warnings
export function MobileWarningBanner({ 
  onDismiss, 
  className = "" 
}: { 
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-orange-50 border border-orange-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-orange-800">
            Mobile Experience Limited
          </h4>
          <p className="text-sm text-orange-700 mt-1">
            Some features may not work optimally on mobile devices. Consider switching to desktop for the full experience.
          </p>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-orange-600 hover:text-orange-800 ml-2 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
