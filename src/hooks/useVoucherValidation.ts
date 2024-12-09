import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVoucherValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validVoucher, setValidVoucher] = useState<{
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
  } | null>(null);
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

      setValidVoucher(voucher);
      return voucher;
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