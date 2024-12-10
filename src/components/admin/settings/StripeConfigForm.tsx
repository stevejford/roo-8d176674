import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { SettingsSectionHeader } from './SettingsSectionHeader';

export const StripeConfigForm = () => {
  const [stripeKey, setStripeKey] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!stripeKey) {
      toast({
        title: "Error",
        description: "Please enter a Stripe key",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.functions.invoke('update-stripe-key', {
        body: { stripeKey }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stripe configuration has been updated",
      });

      setStripeKey('');
    } catch (error) {
      console.error('Error saving Stripe key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update Stripe configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title="Stripe Configuration"
        description="Configure your Stripe integration for payment processing"
      />

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="stripeKey">Stripe Secret Key</Label>
          <Input
            id="stripeKey"
            type="password"
            value={stripeKey}
            onChange={(e) => setStripeKey(e.target.value)}
            placeholder="sk_live_..."
          />
          <p className="text-sm text-gray-500">
            Enter your Stripe secret key. You can find this in your{' '}
            <a 
              href="https://dashboard.stripe.com/apikeys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Stripe Dashboard
            </a>
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={!stripeKey || isLoading}
        >
          {isLoading ? "Saving..." : "Save Stripe Configuration"}
        </Button>
      </div>
    </div>
  );
};