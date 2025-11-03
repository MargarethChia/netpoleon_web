'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/app/(admin)/components/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { showToast } from '@/components/ui/toast';

interface ResourceType {
  id: number;
  name: string;
}

export default function ResourceTypesPage() {
  const [types, setTypes] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/resource-type');
      if (!response.ok) throw new Error('Failed to fetch types');
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error('Error fetching types:', error);
      showToast({
        title: 'Error',
        message: 'Failed to load resource types',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateType = async () => {
    if (!newTypeName.trim()) {
      showToast({
        title: 'Validation Error',
        message: 'Please enter a type name',
        type: 'error',
      });
      return;
    }

    try {
      const response = await fetch('/api/resource-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTypeName.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create type');
      }

      showToast({
        title: 'Success',
        message: 'Resource type created successfully',
        type: 'success',
      });

      setNewTypeName('');
      setIsDialogOpen(false);
      fetchTypes();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create resource type';
      showToast({
        title: 'Error',
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handleDeleteType = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This cannot be undone if resources are using this type.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/resource-type/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete type');
      }

      showToast({
        title: 'Success',
        message: 'Resource type deleted successfully',
        type: 'success',
      });

      fetchTypes();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete resource type';
      showToast({
        title: 'Error',
        message: errorMessage,
        type: 'error',
      });
    }
  };

  return (
    <AdminLayout
      title="Resource Types"
      description="Manage resource types that can be used when creating resources"
      currentPage="/admin/resources/types"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Resource Type</DialogTitle>
                <DialogDescription>
                  Create a new resource type that can be used when creating
                  resources.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Type Name</Label>
                  <Input
                    id="name"
                    value={newTypeName}
                    onChange={e => setNewTypeName(e.target.value)}
                    placeholder="e.g., whitepaper, case-study"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleCreateType();
                      }
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    The name will be normalized (lowercase, hyphens for spaces).
                    For example: &quot;Case Study&quot; becomes
                    &quot;case-study&quot;
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateType}>Create Type</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Existing Types</CardTitle>
            <CardDescription>
              All resource types available for use when creating resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : types.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No resource types found. Create your first type!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {types.map(type => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteType(type.id, type.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
