"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContactAdmin() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiFetch('/contact/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          subject: 'Mentor Application Inquiry',
          reason: 'Application Rejected',
        }),
      });
      
      setSuccess(true);
      setMessage('');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Contact Admin</h1>
      <p className="text-gray-600 mb-6">
        If you have questions about your mentor application status or would like to request reconsideration, please fill out this form.
      </p>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h2>
          <p className="text-green-700 mb-4">
            We&apos;ve received your message and will get back to you as soon as possible.
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

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">We&apos;ll respond to this email address</p>
            </div>

            <div className="mb-6">
              <Label htmlFor="message" className="mb-2 block">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain why you believe your mentor application should be reconsidered..."
                rows={6}
                required
                className="resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
