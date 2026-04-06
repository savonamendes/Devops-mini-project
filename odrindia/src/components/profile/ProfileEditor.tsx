"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Save, X, Upload, Camera, Link, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileData {
  name: string;
  email: string;
  imageAvatar?: string;
  contactNumber?: string;
  country?: string;
  city?: string;
  
  // Role-specific fields that will be mapped properly
  institution?: string;          // Maps to: Innovator.institution, Faculty.institution
  organization?: string;         // Maps to: Mentor.organization
  workplace?: string;           // Maps to: Other.workplace
  role?: string;                // Maps to: Mentor.role, Faculty.role, Other.role
  highestEducation?: string;    // Maps to: Innovator.highestEducation
  courseName?: string;          // Maps to: Innovator.courseName
  courseStatus?: string;        // Maps to: Innovator.courseStatus
  expertise?: string;           // Maps to: Mentor.expertise, Faculty.expertise
  course?: string;              // Maps to: Faculty.course
  mentoring?: boolean;          // Maps to: Faculty.mentoring
  description?: string;         // Maps to: All role tables
  
  userRole: string;
}

// Extended user type with relations matching the schema exactly
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  userRole: string;
  imageAvatar?: string;
  contactNumber?: string;
  country?: string;
  city?: string;
  innovator?: {
    institution?: string;
    highestEducation?: string;
    courseName?: string;
    courseStatus?: string;
    description?: string;
  };
  mentor?: {
    mentorType?: string;
    organization?: string;
    role?: string;
    expertise?: string;
    description?: string;
  };
  faculty?: {
    institution?: string;
    role?: string;
    expertise?: string;
    course?: string;
    mentoring?: boolean;
    description?: string;
  };
  other?: {
    role?: string;
    workplace?: string;
    description?: string;
  };
}

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ProfileEditor({ isOpen, onClose, onSave }: ProfileEditorProps) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    imageAvatar: '',
    contactNumber: '',
    country: '',
    city: '',
    userRole: 'INNOVATOR'
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      // Cast user to any to access extended properties
      const extendedUser = user as any;
      
      // Initialize with base user data
      const baseData: ProfileData = {
        name: user.name || '',
        email: user.email || '',
        imageAvatar: user.imageAvatar || '',
        contactNumber: user.contactNumber || '',
        country: user.country || '',
        city: user.city || '',
        userRole: user.userRole || 'INNOVATOR'
      };

      // Map role-specific data based on userRole
      if (extendedUser.userRole === 'INNOVATOR' && extendedUser.innovator) {
        Object.assign(baseData, {
          institution: extendedUser.innovator.institution || '',
          highestEducation: extendedUser.innovator.highestEducation || '',
          courseName: extendedUser.innovator.courseName || '',
          courseStatus: extendedUser.innovator.courseStatus || '',
          description: extendedUser.innovator.description || ''
        });
      } else if (extendedUser.userRole === 'MENTOR' && extendedUser.mentor) {
        Object.assign(baseData, {
          organization: extendedUser.mentor.organization || '',
          role: extendedUser.mentor.role || '',
          expertise: extendedUser.mentor.expertise || '',
          description: extendedUser.mentor.description || ''
        });
      } else if (extendedUser.userRole === 'FACULTY' && extendedUser.faculty) {
        Object.assign(baseData, {
          institution: extendedUser.faculty.institution || '',
          role: extendedUser.faculty.role || '',
          expertise: extendedUser.faculty.expertise || '',
          course: extendedUser.faculty.course || '',
          mentoring: extendedUser.faculty.mentoring || false,
          description: extendedUser.faculty.description || ''
        });
      } else if (extendedUser.userRole === 'OTHER' && extendedUser.other) {
        Object.assign(baseData, {
          workplace: extendedUser.other.workplace || '',
          role: extendedUser.other.role || '',
          description: extendedUser.other.description || ''
        });
      }

      setFormData(baseData);
      setImageUrlInput(user.imageAvatar || '');
    }
  }, [user, isOpen]);

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrlInput(url);
    setFormData(prev => ({
      ...prev,
      imageAvatar: url
    }));
  };

  const validateImageUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is valid
    try {
      const parsedUrl = new URL(url);
      const allowedHosts = ['googleusercontent.com', 'githubusercontent.com'];
      return (
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) ||
        allowedHosts.includes(parsedUrl.host)
      );
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateImageUrl(formData.imageAvatar || '')) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      await refreshUser();
      toast.success('Profile updated successfully!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="border-none shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-[#0a1e42]">Edit Profile</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Profile Image Section */}
                <motion.div variants={fadeInUp} className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-blue-100">
                      <AvatarImage
                        src={formData.imageAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`}
                        alt={formData.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-white shadow-lg hover:shadow-xl border-2 border-blue-100"
                      onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showImageUrlInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full max-w-md space-y-2"
                      >
                        <Label htmlFor="imageUrl" className="text-sm font-medium">
                          Profile Image URL
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="imageUrl"
                            type="url"
                            placeholder="https://example.com/your-image.jpg"
                            value={imageUrlInput}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            className={`flex-1 ${!validateImageUrl(imageUrlInput) && imageUrlInput ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowImageUrlInput(false)}
                            className="hover:bg-gray-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {!validateImageUrl(imageUrlInput) && imageUrlInput && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Please enter a valid image URL ending with .jpg, .jpeg, .png, .gif, .webp, or .svg
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Basic Information */}
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled // Email usually shouldn't be editable
                      className="bg-gray-50"
                    />
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-sm font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      Contact Number
                    </Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      placeholder="Enter your contact number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userRole" className="text-sm font-medium">
                      User Role
                    </Label>
                    <Input
                      id="userRole"
                      value={formData.userRole?.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </motion.div>

                {/* Location Information */}
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter your country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                </motion.div>

                {/* Role-Specific Information */}
                {formData.userRole === 'INNOVATOR' && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0a1e42] border-b pb-2">Student/Innovator Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution" className="text-sm font-medium flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-600" />
                          Institution
                        </Label>
                        <Input
                          id="institution"
                          value={formData.institution || ''}
                          onChange={(e) => handleInputChange('institution', e.target.value)}
                          placeholder="Enter your institution"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="highestEducation" className="text-sm font-medium">
                          Highest Education
                        </Label>
                        <Input
                          id="highestEducation"
                          value={formData.highestEducation || ''}
                          onChange={(e) => handleInputChange('highestEducation', e.target.value)}
                          placeholder="Enter your highest education"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courseName" className="text-sm font-medium">
                          Course Name
                        </Label>
                        <Input
                          id="courseName"
                          value={formData.courseName || ''}
                          onChange={(e) => handleInputChange('courseName', e.target.value)}
                          placeholder="Enter your course name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courseStatus" className="text-sm font-medium">
                          Course Status
                        </Label>
                        <Select value={formData.courseStatus || ''} onValueChange={(value) => handleInputChange('courseStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {formData.userRole === 'MENTOR' && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0a1e42] border-b pb-2">Mentor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organization" className="text-sm font-medium flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-600" />
                          Organization
                        </Label>
                        <Input
                          id="organization"
                          value={formData.organization || ''}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          placeholder="Enter your organization"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                          Role/Position
                        </Label>
                        <Input
                          id="role"
                          value={formData.role || ''}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          placeholder="Enter your role"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="expertise" className="text-sm font-medium">
                          Expertise
                        </Label>
                        <Input
                          id="expertise"
                          value={formData.expertise || ''}
                          onChange={(e) => handleInputChange('expertise', e.target.value)}
                          placeholder="Enter your areas of expertise"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {formData.userRole === 'FACULTY' && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0a1e42] border-b pb-2">Faculty Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution" className="text-sm font-medium flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-600" />
                          Institution
                        </Label>
                        <Input
                          id="institution"
                          value={formData.institution || ''}
                          onChange={(e) => handleInputChange('institution', e.target.value)}
                          placeholder="Enter your institution"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                          Role/Position
                        </Label>
                        <Input
                          id="role"
                          value={formData.role || ''}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          placeholder="Enter your role"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expertise" className="text-sm font-medium">
                          Expertise
                        </Label>
                        <Input
                          id="expertise"
                          value={formData.expertise || ''}
                          onChange={(e) => handleInputChange('expertise', e.target.value)}
                          placeholder="Enter your areas of expertise"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course" className="text-sm font-medium">
                          Course
                        </Label>
                        <Input
                          id="course"
                          value={formData.course || ''}
                          onChange={(e) => handleInputChange('course', e.target.value)}
                          placeholder="Enter course you teach"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="mentoring"
                            checked={formData.mentoring || false}
                            onChange={(e) => handleInputChange('mentoring', e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="mentoring" className="text-sm font-medium">
                            Available for mentoring
                          </Label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {formData.userRole === 'OTHER' && (
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0a1e42] border-b pb-2">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workplace" className="text-sm font-medium flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-600" />
                          Workplace
                        </Label>
                        <Input
                          id="workplace"
                          value={formData.workplace || ''}
                          onChange={(e) => handleInputChange('workplace', e.target.value)}
                          placeholder="Enter your workplace"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                          Role/Position
                        </Label>
                        <Input
                          id="role"
                          value={formData.role || ''}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          placeholder="Enter your role"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bio/Description */}
                <motion.div variants={fadeInUp} className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Bio/Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={fadeInUp} className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={loading || !formData.name || !formData.email}
                    className="bg-gradient-to-r from-[#0a1e42] to-[#3a86ff] hover:from-[#152a4e] hover:to-[#4a8bff]"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
