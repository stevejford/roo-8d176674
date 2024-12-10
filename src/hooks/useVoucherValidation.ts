import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { create } from 'zustand';

export type VoucherDiscountType = 'percentage' | 'fixed';

export interface Voucher {
  code: string;
  discount_type: VoucherDiscountType;
  discount_value: number;
}

interface VoucherStore {
  validVoucher: Voucher | null;
  setVoucher: (voucher: Voucher | null) => void;
}

const useVoucherStore = create<VoucherStore>((set) => ({
  validVoucher: null,
  setVoucher: (voucher) => set({ validVoucher: voucher }),
}));

export const useVoucherValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { validVoucher, setVoucher } = useVoucherStore();

  const validateVoucher = async (code: string) => {
    if (!code) {
      setError('Please enter a voucher code');
      return null;
    }

    setIsValidating(true);
    setError(null);

    try {
      console.log('Validating voucher:', code);
      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .maybeSingle();

      if (voucherError) {
        throw voucherError;
      }

      if (!voucher) {
        setError('Invalid voucher code');
        setVoucher(null);
        return null;
      }

      // Type guard to ensure discount_type is valid
      if (voucher.discount_type !== 'percentage' && voucher.discount_type !== 'fixed') {
        setError('Invalid voucher type');
        setVoucher(null);
        return null;
      }

      // Now TypeScript knows discount_type is either 'percentage' or 'fixed'
      const validatedVoucher: Voucher = {
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value
      };

      console.log('Setting validated voucher:', validatedVoucher);
      setVoucher(validatedVoucher);
      return validatedVoucher;
    } catch (err) {
      console.error('Error validating voucher:', err);
      setError('Error validating voucher');
      setVoucher(null);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const clearVoucher = () => {
    console.log('Clearing voucher');
    setVoucher(null);
    setError(null);
  };

  return {
    validateVoucher,
    clearVoucher,
    isValidating,
    validVoucher,
    error
  };
};