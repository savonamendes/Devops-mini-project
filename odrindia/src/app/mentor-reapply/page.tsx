"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MentorReapply() {
  const { user } = useAuth();
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalInfo) {
      setError('Please provide additional information for your reapplication');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch('/mentors/reapply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          additionalInfo,
        }),
      });
      
      setSuccess(true);
      setAdditionalInfo('');
    } catch (err) {
      console.error('Error submitting reapplication:', err);
      setError('Failed to submit reapplication. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // If user is not a mentor, redirect
  if (user && user.userRole !== "MENTOR") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Not Applicable</h2>
          <p className="text-yellow-700 mb-4">
            This page is only for users who need to reapply as mentors.
          </p>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            className="bg-yellow-600 hover:bg-yellow-700 text-white">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Reapply as Mentor</h1>
      <p className="text-gray-600 mb-6">
        Please provide additional information to support your mentor application.
      </p>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Reapplication Submitted!</h2>
          <p className="text-green-700 mb-4">
            Your mentor reapplication has been submitted for review. We&apos;ll notify you once it&apos;s been processed.
          </p>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            className="bg-green-600 hover:bg-green-700 text-white">
            Return to Dashboard
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
          {error && (
            <div className="mb-4 flex items-start p-3 bg-red-50 border border-red-200 rounded text-red-800">
              <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {user?.mentorRejectionReason && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800">Previous Application Rejection Reason:</h3>
              <p className="text-amber-700 mt-1">{user.mentorRejectionReason}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label htmlFor="additionalInfo" className="mb-2 block">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Please address the concerns from your previous application and provide any additional qualifications or information that might help your application..."
                rows={8}
                required
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Be specific about your expertise and how you can contribute as a mentor</p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Submitting...' : 'Submit Reapplication'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
