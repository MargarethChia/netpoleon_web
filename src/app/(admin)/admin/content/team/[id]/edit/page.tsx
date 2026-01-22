'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import AdminLayout from '@/app/(admin)/components/AdminLayout';
import { teamMembersApi, TeamMember } from '@/lib/api';
import { showToast } from '@/components/ui/toast';
import { uploadImage } from '@/lib/storage';

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    photo: '',
    secondary_photo: '',
  });

  // Fetch team member data
  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        setIsLoadingData(true);
        const memberId = parseInt(params.id as string);
        const data = await teamMembersApi.getById(memberId);
        setTeamMember(data);
        setFormData({
          name: data.name,
          role: data.role,
          photo: data.photo || '',
          secondary_photo: data.secondary_photo || '',
        });
      } catch {
        showToast({
          title: 'Error',
          message: 'Failed to load team member',
          type: 'error',
        });
        router.push('/admin/content/team');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTeamMember();
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (
    file: File,
    field: 'photo' | 'secondary_photo'
  ) => {
    setIsUploading(true);

    try {
      const result = await uploadImage(file);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, [field]: result.url! }));
        showToast({
          title: 'Success',
          message: 'Image uploaded successfully!',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Upload Failed',
          message: result.error || 'Failed to upload image',
          type: 'error',
        });
      }
    } catch {
      showToast({
        title: 'Upload Failed',
        message: 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'photo' | 'secondary_photo'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, field);
    }
  };

  const removeImage = (field: 'photo' | 'secondary_photo') => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.role.trim()) {
      showToast({
        title: 'Error',
        message: 'Name and role are required',
        type: 'error',
      });
      return;
    }

    if (!teamMember) return;

    try {
      setIsLoading(true);
      await teamMembersApi.update(teamMember.id, {
        name: formData.name.trim(),
        role: formData.role.trim(),
        photo: formData.photo.trim() || null,
        secondary_photo: formData.secondary_photo.trim() || null,
      });

      showToast({
        title: 'Success',
        message: 'Team member updated successfully',
        type: 'success',
      });

      router.push('/admin/content/team');
    } catch {
      showToast({
        title: 'Error',
        message: 'Failed to update team member',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/content/team');
  };

  if (isLoadingData) {
    return (
      <AdminLayout
        title="Edit Team Member"
        description="Update team member information"
        currentPage="/admin/content/team"
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-48 bg-muted rounded mb-2"></div>
              <div className="h-4 w-64 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-4 w-12 bg-muted rounded"></div>
                    <div className="h-10 w-full bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-12 bg-muted rounded"></div>
                    <div className="h-10 w-full bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-10 w-full bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!teamMember) {
    return (
      <AdminLayout
        title="Edit Team Member"
        description="Update team member information"
        currentPage="/admin/content/team"
      >
        <div className="text-center py-8">
          <p className="text-muted-foreground">Team member not found</p>
          <Button onClick={handleCancel} className="mt-4">
            Back to Team
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Edit Team Member"
      description="Update team member information"
      currentPage="/admin/content/team"
    >
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Team Member Information</CardTitle>
            <CardDescription>
              Update the details for {teamMember.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter team member's name"
                    required
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Enter team member's role/title"
                    required
                  />
                </div>
              </div>

              {/* Photo Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Photo */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Primary Photo</Label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="flex gap-2">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileSelect(e, 'photo')}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('photo')?.click()
                        }
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                      {formData.photo && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage('photo')}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Image Preview */}
                    {formData.photo && (
                      <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        <Image
                          unoptimized
                          src={formData.photo}
                          alt="Primary photo preview"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Secondary Photo */}
                <div className="space-y-2">
                  <Label htmlFor="secondary_photo">Secondary Photo</Label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="flex gap-2">
                      <input
                        id="secondary_photo"
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileSelect(e, 'secondary_photo')}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('secondary_photo')?.click()
                        }
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                      {formData.secondary_photo && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage('secondary_photo')}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Image Preview */}
                    {formData.secondary_photo && (
                      <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        <Image
                          unoptimized
                          src={formData.secondary_photo}
                          alt="Secondary photo preview"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Updating...' : 'Update Team Member'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
