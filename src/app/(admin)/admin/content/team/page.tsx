'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Edit, Trash2, Search, Users } from 'lucide-react';
import AdminLayout from '@/app/(admin)/components/AdminLayout';
import { TeamMember, teamMembersApi } from '@/lib/api';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { showToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await teamMembersApi.getAll();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      showToast({
        title: 'Error',
        message: 'Failed to load team members',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const router = useRouter();

  const handleAddMember = () => {
    router.push('/admin/content/team/create');
  };

  const handleEditMember = (memberId: number) => {
    router.push(`/admin/content/team/${memberId}/edit`);
  };

  const handleDeleteMember = (memberId: number) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      setMemberToDelete(member);
      setShowDeleteDialog(true);
    }
  };

  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(
    member =>
      !searchTerm ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout
        title="Team Members"
        description="Manage your team members and their information"
        currentPage="/admin/content/team"
        showAddButton={true}
        addButtonText="Add Team Member"
        onAddClick={handleAddMember}
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Search Loading */}
          <Card className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500">
            <CardHeader>
              <div className="h-6 w-36 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-64 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardContent>
          </Card>

          {/* Team Members Table Loading */}
          <Card
            className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: '100ms' }}
          >
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-56 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="w-12 h-12 bg-muted rounded-full transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-40 bg-muted rounded mb-1 transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-32 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-8 w-8 bg-muted rounded transition-all duration-300 ease-out"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Team Members"
      description="Manage your team members and their information"
      currentPage="/admin/content/team"
      showAddButton={true}
      addButtonText="Add Team Member"
      onAddClick={handleAddMember}
    >
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Team Members</CardTitle>
            <CardDescription>
              Find specific team members by name or role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search team members..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Team Members</CardTitle>
            <CardDescription>
              {filteredMembers.length} team members total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? 'No team members found matching your search.'
                  : 'No team members found. Add your first team member!'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {member.photo ? (
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                              <Image
                                src={member.photo}
                                alt={`${member.name} photo`}
                                width={48}
                                height={48}
                                className="object-cover rounded-full"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{member.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{member.role}</div>
                      </TableCell>
                      <TableCell>
                        {member.photo ? (
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs">Photo</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No photo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(member.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditMember(member.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {teamMembers.length}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                With Photos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {teamMembers.filter(m => m.photo).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Have profile photos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setMemberToDelete(null);
        }}
        onConfirm={async () => {
          if (memberToDelete) {
            try {
              await teamMembersApi.delete(memberToDelete.id);
              fetchTeamMembers(); // Refresh the data
              setShowDeleteDialog(false);
              setMemberToDelete(null);
              showToast({
                title: 'Success',
                message: 'Team member deleted successfully',
                type: 'success',
              });
            } catch (error) {
              console.error('Error deleting team member:', error);
              showToast({
                title: 'Error',
                message: 'Failed to delete team member',
                type: 'error',
              });
            }
          }
        }}
        title="Delete Team Member"
        message={`Are you sure you want to delete "${memberToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </AdminLayout>
  );
}
