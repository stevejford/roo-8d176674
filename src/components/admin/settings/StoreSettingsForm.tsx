import React from 'react';
import { BusinessInfoForm } from './BusinessInfoForm';
import { ServiceTimingForm } from './ServiceTimingForm';
import { StoreHoursForm } from './StoreHoursForm';
import { BillSplittingForm } from './BillSplittingForm';
import { StripeConfigForm } from './StripeConfigForm';

export const StoreSettingsForm = () => {
  return (
    <div className="space-y-12">
      <BusinessInfoForm />
      <ServiceTimingForm />
      <StoreHoursForm />
      <BillSplittingForm />
      <StripeConfigForm />
    </div>
  );
};