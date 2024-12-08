import React from 'react';
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onClose: () => void;
  onSave: () => void;
  disabled?: boolean;
}

export const DialogActions = ({ onClose, onSave, disabled }: DialogActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        onClick={onSave}
        disabled={disabled}
      >
        Save
      </Button>
    </div>
  );
};