import React from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StoreHours {
  id: string;
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

interface HoursTableProps {
  hours: StoreHours[];
  onTimeChange: (id: string, field: 'open_time' | 'close_time', value: string) => void;
  onClosedToggle: (id: string, value: boolean) => void;
}

export const HoursTable = ({
  hours,
  onTimeChange,
  onClosedToggle
}: HoursTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Open Time</TableHead>
          <TableHead>Close Time</TableHead>
          <TableHead>Closed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hours?.map((hour) => (
          <TableRow key={hour.id}>
            <TableCell>{hour.day_of_week}</TableCell>
            <TableCell>
              <Input
                type="time"
                value={hour.open_time || ''}
                onChange={(e) => onTimeChange(hour.id, 'open_time', e.target.value)}
                disabled={hour.is_closed}
              />
            </TableCell>
            <TableCell>
              <Input
                type="time"
                value={hour.close_time || ''}
                onChange={(e) => onTimeChange(hour.id, 'close_time', e.target.value)}
                disabled={hour.is_closed}
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={hour.is_closed}
                onCheckedChange={(checked) => onClosedToggle(hour.id, checked)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};