import React from 'react';
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['user_role'];

interface InviteFormData {
  email: string;
  role: UserRole;
}

export const InviteStaffDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<InviteFormData>({
    defaultValues: {
      email: '',
      role: 'staff',
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      const token = Math.random().toString(36).substring(2);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      // Create invitation record
      const { error: inviteError } = await supabase
        .from('invitations')
        .insert({
          email: data.email,
          role: data.role,
          token,
          expires_at: expiresAt.toISOString(),
        });

      if (inviteError) throw inviteError;

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-invitation', {
        body: { email: data.email, token, role: data.role },
      });

      if (emailError) throw emailError;
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Error sending invitation:', error);
      toast.error("Failed to send invitation");
    },
  });

  const onSubmit = (data: InviteFormData) => {
    inviteMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Invite Staff Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Staff Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={inviteMutation.isPending}
            >
              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};