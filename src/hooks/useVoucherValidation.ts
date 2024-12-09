import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type VoucherDiscountType = 'percentage' | 'fixed';

interface Voucher {
  code: string;
  discount_type: VoucherDiscountType;
  discount_value: number;
}

interface VoucherResponse {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useVoucherValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validVoucher, setValidVoucher] = useState<Voucher | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateVoucher = async (code: string) => {
    if (!code) {
      setError('Please enter a voucher code');
      return null;
    }

    setIsValidating(true);
    setError(null);

    try {
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
        setValidVoucher(null);
        return null;
      }

      // Type guard to ensure discount_type is valid
      if (voucher.discount_type !== 'percentage' && voucher.discount_type !== 'fixed') {
        setError('Invalid voucher type');
        setValidVoucher(null);
        return null;
      }

      // Now TypeScript knows discount_type is either 'percentage' or 'fixed'
      const validatedVoucher: Voucher = {
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_value: voucher.discount_value
      };

      setValidVoucher(validatedVoucher);
      return validatedVoucher;
    } catch (err) {
      console.error('Error validating voucher:', err);
      setError('Error validating voucher');
      setValidVoucher(null);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const clearVoucher = () => {
    setValidVoucher(null);
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