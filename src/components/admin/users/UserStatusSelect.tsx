import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800"
} as const;

interface UserStatusSelectProps {
  userId: string;
  currentStatus: string | null;
  onStatusChange: (status: string) => void;
}

export const UserStatusSelect = ({ userId, currentStatus, onStatusChange }: UserStatusSelectProps) => {
  return (
    <Select
      value={currentStatus || 'active'}
      onValueChange={(value) => onStatusChange(value)}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <Badge className={statusColors[currentStatus as keyof typeof statusColors] || statusColors.active}>
            {currentStatus || 'active'}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
      </SelectContent>
    </Select>
  );
};