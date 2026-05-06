'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { pricingService } from '@/services/pricing/pricing.service';
import { fetchPricingRules, createPricingRule, updatePricingRule, deletePricingRule, togglePricingRule } from '@/features/pricing/pricingSlice';
import type { RootState } from '@/store';
import { Loader } from '@/components/ui/loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminPricingPage() {
  const dispatch = useDispatch();
  const rules = useSelector((s: RootState) => s.pricing.items);
  const loading = useSelector((s: RootState) => s.pricing.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchPricingRules() as any);
  }, [dispatch]);

  const ruleSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    discountPercentage: Yup.number().min(0).max(100).required('Discount % is required'),
    maxDiscount: Yup.number().min(0).nullable(),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
    priority: Yup.number().min(0).required('Priority is required'),
  });

  const editFormik = useFormik({
    initialValues: {
      name: '', description: '', discountPercentage: 0, maxDiscount: null as number | null,
      startDate: '', endDate: '', priority: 0, isActive: true,
    },
    validationSchema: ruleSchema,
    onSubmit: async (values) => {
      if (selectedRule) {
        await dispatch(updatePricingRule({ id: selectedRule.id, data: values }) as any);
      } else {
        await dispatch(createPricingRule(values) as any);
      }
      setIsModalOpen(false);
    },
  });

  const handleEdit = (rule: any) => {
    setSelectedRule(rule);
    editFormik.setValues({
      ...rule,
      maxDiscount: rule.maxDiscount || null,
    });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedRule(null);
    editFormik.resetForm();
    editFormik.setValues({
      name: '', description: '', discountPercentage: 0, maxDiscount: null,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      priority: 0, isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleToggle = async (rule: any) => {
    await dispatch(togglePricingRule({ id: rule.id, active: !rule.isActive }) as any);
  };

  const confirmDelete = (id: number) => {
    setRuleToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (ruleToDelete) {
      await dispatch(deletePricingRule(ruleToDelete) as any);
      setDeleteModalOpen(false);
      setRuleToDelete(null);
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'discountPercentage',
      header: 'Discount %',
      render: (item: any) => `${item.discountPercentage}%`,
    },
    {
      key: 'maxDiscount',
      header: 'Max Discount',
      render: (item: any) => (item.maxDiscount ? `$${item.maxDiscount}` : 'Unlimited'),
    },
    { key: 'priority', header: 'Priority' },
    {
      key: 'isActive',
      header: 'Status',
      render: (item: any) => (
        <Badge variant={item.isActive ? 'success' : 'secondary'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={item.isActive ? 'secondary' : 'default'}
            onClick={() => handleToggle(item)}
          >
            {item.isActive ? (
              <ToggleLeft className="h-4 w-4" />
            ) : (
              <ToggleRight className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => confirmDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pricing Rules</h1>
        <Button onClick={handleNew}>Add Rule</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <Table columns={columns} data={rules} emptyMessage="No pricing rules found" />
      )}

      <Modal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedRule(null);
        }}
        title={selectedRule ? 'Edit Pricing Rule' : 'New Pricing Rule'}
      >
        <form onSubmit={editFormik.handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...editFormik.getFieldProps('name')} />
            {editFormik.touched.name && editFormik.errors.name && (
              <div className="text-red-500 text-sm">{editFormik.errors.name}</div>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Input {...editFormik.getFieldProps('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Discount %</Label>
              <Input type="number" {...editFormik.getFieldProps('discountPercentage')} />
            </div>
            <div>
              <Label>Max Discount ($)</Label>
              <Input type="number" {...editFormik.getFieldProps('maxDiscount')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input type="datetime-local" {...editFormik.getFieldProps('startDate')} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="datetime-local" {...editFormik.getFieldProps('endDate')} />
            </div>
          </div>
          <div>
            <Label>Priority</Label>
            <Input type="number" {...editFormik.getFieldProps('priority')} />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit">{selectedRule ? 'Save' : 'Create'}</Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Delete"
      >
        <p className="mb-4">Are you sure you want to delete this pricing rule?</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
