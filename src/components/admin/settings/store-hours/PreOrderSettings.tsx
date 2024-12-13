import React from 'react';
import { Switch } from "@/components/ui/switch";

interface PreOrderSettingsProps {
  acceptPreorders: boolean;
  onPreorderToggle: (checked: boolean) => void;
}

export const PreOrderSettings = ({ 
  acceptPreorders, 
  onPreorderToggle 
}: PreOrderSettingsProps) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4 mb-6">
      <div className="space-y-0.5">
        <h3 className="text-base font-medium">Accept Pre-orders</h3>
        <p className="text-sm text-muted-foreground">
          Allow customers to place orders for next-day delivery when the store is closed
        </p>
      </div>
      <Switch
        checked={acceptPreorders}
        onCheckedChange={onPreorderToggle}
      />
    </div>
  );
};