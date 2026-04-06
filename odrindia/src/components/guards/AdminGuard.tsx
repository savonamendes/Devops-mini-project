"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { toast } from "sonner";

export default function AdminGuard({
  children,
  redirectTo = "/signin",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // First - if we're not in a loading state, check for admin access
    if (!loading) {
      console.log("AdminGuard - Auth check complete:", { 
        authenticated: !!user, 
        role: user?.userRole 
      });
      
      if (!user) {
        // Not authenticated - redirect to login
        const currentPath = window.location.pathname;
        console.log(`AdminGuard - No authenticated user, redirecting to ${redirectTo}`);
        
        // Prevent redirect loops
        if (currentPath !== redirectTo) {
          router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
          
          toast.info("Please login to access the admin area");
        }
      } else if (user.userRole !== "ADMIN") {
        // Authenticated but not admin - redirect to home
        console.log(`AdminGuard - User role ${user.userRole} is not ADMIN, redirecting to home`);
        router.push("/");
        
        toast.error("You need administrator privileges to access this area");
      } else {
        // Everything good - refresh user data to ensure we have latest permissions
        console.log("AdminGuard - Admin access confirmed");
        refreshUser().catch(err => {
          console.error("Failed to refresh admin user data:", err);
        });
      }
    }
  }, [user, loading, router, redirectTo, refreshUser]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0a1e42]"></div>
          <p className="text-lg text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  // Don't render children if not admin
  if (!user || user.userRole !== "ADMIN") {
    return null;
  }
  
  // Render children for admin users
  return <>{children}</>;
}
