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
import { userService } from '@/services/users/user.service';
import { fetchUsers, updateUserRole, deleteUser } from '@/features/users/usersSlice';
import type { RootState } from '@/store';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((s: RootState) => s.users.items);
  const loading = useSelector((s: RootState) => s.users.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, [dispatch]);

  const editSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const editFormik = useFormik({
    initialValues: { name: '', email: '', role: 'USER' as 'ADMIN' | 'USER' },
    validationSchema: editSchema,
    onSubmit: async (values) => {
      if (selectedUser) {
        await dispatch(updateUserRole({ id: selectedUser.id, role: values.role }) as any);
        setIsModalOpen(false);
      }
    },
  });

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    editFormik.setValues({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await dispatch(deleteUser(userToDelete) as any);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u: any) =>
    filterRole ? u.role === filterRole : true
  );

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (item: any) => (
        <Badge variant={item.role === 'ADMIN' ? 'default' : 'secondary'}>
          {item.role}
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
            variant="danger"
            onClick={() => {
              setUserToDelete(item.id);
              setDeleteModalOpen(true);
            }}
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
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Filter by role..."
            value={filterRole}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterRole(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredUsers}
          emptyMessage="No users found"
        />
      )}

      <Modal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedUser(null);
        }}
        title="Edit User"
      >
        <form onSubmit={editFormik.handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={editFormik.values.name} disabled />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={editFormik.values.email} disabled />
          </div>
          <div>
            <Label>Role</Label>
            <button
              type="button"
              onClick={() => editFormik.setFieldValue(
                'role',
                editFormik.values.role === 'ADMIN' ? 'USER' : 'ADMIN'
              )}
              className={`w-full p-2 rounded ${editFormik.values.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              {editFormik.values.role}
            </button>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
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
        <p className="mb-4">Are you sure you want to delete this user?</p>
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
