import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface PricingStrategyCardProps {
  strategy: {
    id: string;
    name: string;
    type: string;
    config: any;
  };
  onEdit: () => void;
}

export const PricingStrategyCard = ({ strategy, onEdit }: PricingStrategyCardProps) => {
  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{strategy.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Type: {formatType(strategy.type)}
        </div>
        <div className="mt-4">
          <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-32">
            {JSON.stringify(strategy.config, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};