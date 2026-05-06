'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { settingsService } from '@/services/settings/settings.service';
import { fetchSettings, updateSetting } from '@/features/settings/settingsSlice';
import type { RootState } from '@/store';
import { Loader } from '@/components/ui/loader';

export default function AdminSettingsPage() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.settings.items);
  const loading = useSelector((s: RootState) => s.settings.loading);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSettings() as any);
  }, [dispatch]);

  const settingSchema = Yup.object().shape({
    value: Yup.string().required('Value is required'),
    description: Yup.string(),
  });

  const editFormik = useFormik({
    initialValues: { key: '', value: '', description: '' },
    validationSchema: settingSchema,
    onSubmit: async (values) => {
      await dispatch(updateSetting({ key: values.key, value: values.value, description: values.description }) as any);
      setEditingKey(null);
    },
  });

  const handleEdit = (key: string, currentValue: string, currentDesc: string) => {
    setEditingKey(key);
    editFormik.setValues({ key, value: currentValue, description: currentDesc });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Global Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuration Settings</CardTitle>
          <CardDescription>Manage system-wide configuration values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                {editingKey === s.key ? (
                  <form
                    onSubmit={editFormik.handleSubmit}
                    className="flex gap-4 flex-1 items-end"
                  >
                    <div className="flex-1">
                      <Label>Key</Label>
                      <Input value={s.key} disabled />
                    </div>
                    <div className="flex-1">
                      <Label>Value</Label>
                      <Input {...editFormik.getFieldProps('value')} />
                    </div>
                    <div className="flex-1">
                      <Label>Description</Label>
                      <Input {...editFormik.getFieldProps('description')} />
                    </div>
                    <div className="flex gap-2 pb-2">
                      <Button type="submit" size="sm">Save</Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingKey(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{s.key}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                    </div>
                    <div className="text-lg font-mono mr-4">{s.value}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(s.key, s.value, s.description)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
