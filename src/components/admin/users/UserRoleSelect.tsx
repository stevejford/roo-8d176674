import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

const roleColors = {
  admin: "bg-red-100 text-red-800",
  manager: "bg-purple-100 text-purple-800",
  kitchen: "bg-yellow-100 text-yellow-800",
  staff: "bg-blue-100 text-blue-800",
  delivery: "bg-green-100 text-green-800",
  owner: "bg-indigo-100 text-indigo-800",
  user: "bg-gray-100 text-gray-800"
} as const;

interface UserRoleSelectProps {
  userId: string;
  currentRole: UserRole | null;
  onRoleChange: (role: UserRole) => void;
}

export const UserRoleSelect = ({ userId, currentRole, onRoleChange }: UserRoleSelectProps) => {
  return (
    <Select
      value={currentRole || 'user'}
      onValueChange={(value: UserRole) => onRoleChange(value)}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <Badge className={roleColors[currentRole as keyof typeof roleColors] || roleColors.user}>
            {currentRole || 'user'}
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
  );
};