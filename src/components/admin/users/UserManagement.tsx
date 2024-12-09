import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const roleColors = {
  admin: "bg-red-100 text-red-800",
  manager: "bg-purple-100 text-purple-800",
  kitchen: "bg-yellow-100 text-yellow-800",
  staff: "bg-blue-100 text-blue-800",
  delivery: "bg-green-100 text-green-800",
  owner: "bg-indigo-100 text-indigo-800",
  user: "bg-gray-100 text-gray-800"
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800"
};

export const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role');
      
      if (error) throw error;
      return data;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role, status }: { id: string, role?: string, status?: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...(role && { role }),
          ...(status && { status })
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserMutation.mutate({ id: userId, role: newRole });
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    updateUserMutation.mutate({ id: userId, status: newStatus });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Sign In</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {(user.first_name?.[0] || '') + (user.last_name?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.phone || 'No phone'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={user.role || 'user'}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      <Badge className={roleColors[user.role as keyof typeof roleColors] || roleColors.user}>
                        {user.role || 'user'}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={user.status || 'active'}
                  onValueChange={(value) => handleStatusChange(user.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      <Badge className={statusColors[user.status as keyof typeof statusColors] || statusColors.active}>
                        {user.status || 'active'}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {user.last_sign_in_at ? (
                  new Date(user.last_sign_in_at).toLocaleDateString()
                ) : (
                  'Never'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};