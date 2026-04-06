"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ApplyMentorPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    mentorType: "",
    organization: "",
    expertise: "",
    description: "",
    previousRejection: user?.mentorRejectionReason || "No reason provided"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, mentorType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.mentorType) {
      setError("Please select a mentor type");
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch('/user/apply-mentor', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit mentor application");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error applying as mentor:", err);
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-3">Apply as Mentor</h1>
      
      {user?.mentorRejectionReason && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="font-medium text-amber-800">Previous Application Feedback:</h3>
          <p className="text-amber-700 mt-1">{user.mentorRejectionReason}</p>
          <p className="text-sm text-amber-600 mt-2">Please address this feedback in your new application.</p>
        </div>
      )}
      
      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center my-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-800 mb-3">Application Submitted!</h2>
          <p className="text-green-700 mb-6 max-w-md mx-auto">
            Your mentor application has been submitted for review. We&apos;ll evaluate your application and notify you of the decision.
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-green-600 hover:bg-green-700 text-white">
            Return to Dashboard
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-md text-red-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <Label className="text-lg font-medium block mb-3">Select Mentor Type</Label>
            <RadioGroup 
              value={formData.mentorType} 
              onValueChange={handleRadioChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className={`border rounded-md p-4 ${formData.mentorType === "TECHNICAL_EXPERT" ? "bg-blue-50 border-blue-300" : "border-gray-200"}`}>
                <RadioGroupItem value="TECHNICAL_EXPERT" id="technical" className="sr-only" />
                <Label htmlFor="technical" className="flex items-start cursor-pointer">
                  <div>
                    <div className="font-medium">Technical Expert</div>
                    <p className="text-sm text-gray-500">For mentors with tech expertise</p>
                  </div>
                </Label>
              </div>
              
              <div className={`border rounded-md p-4 ${formData.mentorType === "LEGAL_EXPERT" ? "bg-blue-50 border-blue-300" : "border-gray-200"}`}>
                <RadioGroupItem value="LEGAL_EXPERT" id="legal" className="sr-only" />
                <Label htmlFor="legal" className="flex items-start cursor-pointer">
                  <div>
                    <div className="font-medium">Legal Expert</div>
                    <p className="text-sm text-gray-500">For mentors with legal expertise</p>
                  </div>
                </Label>
              </div>
              
              <div className={`border rounded-md p-4 ${formData.mentorType === "ODR_EXPERT" ? "bg-blue-50 border-blue-300" : "border-gray-200"}`}>
                <RadioGroupItem value="ODR_EXPERT" id="odr" className="sr-only" />
                <Label htmlFor="odr" className="flex items-start cursor-pointer">
                  <div>
                    <div className="font-medium">ODR Expert</div>
                    <p className="text-sm text-gray-500">For online dispute resolution specialists</p>
                  </div>
                </Label>
              </div>
              
              <div className={`border rounded-md p-4 ${formData.mentorType === "CONFLICT_RESOLUTION_EXPERT" ? "bg-blue-50 border-blue-300" : "border-gray-200"}`}>
                <RadioGroupItem value="CONFLICT_RESOLUTION_EXPERT" id="conflict" className="sr-only" />
                <Label htmlFor="conflict" className="flex items-start cursor-pointer">
                  <div>
                    <div className="font-medium">Conflict Resolution Expert</div>
                    <p className="text-sm text-gray-500">For dispute management specialists</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="organization">Organization / Institution</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Your organization or institution"
              required
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="expertise">Areas of Expertise</Label>
            <Input
              id="expertise"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="Your areas of expertise (comma separated)"
              required
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="description">
              Professional Background & Mentoring Approach
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please describe your professional background, qualifications, and approach to mentoring. If this is a reapplication, please address the feedback from your previous application."
              rows={6}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide details about your experience and how you can contribute as a mentor
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Submitting..." : "Submit Mentor Application"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
