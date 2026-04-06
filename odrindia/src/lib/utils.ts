import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function for saving form submission IDs in local storage
export function saveSubmissionRecord(submissionType: string, id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const storedSubmissions = localStorage.getItem('userSubmissions') || '{}';
    const submissions = JSON.parse(storedSubmissions);
    
    if (!submissions[submissionType]) {
      submissions[submissionType] = [];
    }
    
    // Add the new submission ID
    submissions[submissionType].push({
      id,
      date: new Date().toISOString()
    });
    
    // Store back in localStorage
    localStorage.setItem('userSubmissions', JSON.stringify(submissions));
  } catch (error) {
    console.error('Error saving submission record:', error);
  }
}

// Helper to format dates in a user-friendly way
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Use a consistent format that works both server and client side
  // This prevents hydration mismatches due to locale differences
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Use UTC to ensure consistency
    }).format(date);
  } catch (error) {
    // Fallback to simple format if Intl fails
    return date.toISOString().split('T')[0];
  }
}
