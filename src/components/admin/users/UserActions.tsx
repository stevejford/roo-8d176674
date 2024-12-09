import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

interface UserAction {
  id: string;
  action_type: string;
  action_details: any;
  created_at: string;
}

export const UserActions = ({ userId }: { userId: string }) => {
  const { data: actions, isLoading } = useQuery({
    queryKey: ['userActions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserAction[];
    },
  });

  if (isLoading) return <div>Loading actions...</div>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">User Actions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions?.map((action) => (
            <TableRow key={action.id}>
              <TableCell className="capitalize">
                {action.action_type.replace(/_/g, ' ')}
              </TableCell>
              <TableCell>
                {JSON.stringify(action.action_details)}
              </TableCell>
              <TableCell>
                {format(new Date(action.created_at), 'PPp')}
              </TableCell>
            </TableRow>
          ))}
          {!actions?.length && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No actions recorded
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};