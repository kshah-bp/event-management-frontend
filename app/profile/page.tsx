'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log('Update profile:', values);
      setIsEditing(false);
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...formik.getFieldProps('name')}
                  disabled={!isEditing}
                />
                {isEditing && formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  disabled={!isEditing}
                />
                {isEditing && formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <Input value={user?.role || ''} disabled />
              </div>
            </div>
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
