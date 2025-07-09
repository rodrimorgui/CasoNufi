'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { createClient } from '@/lib/server';

export const checkoutAction = async (formData: FormData) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ userId: user.id, priceId });
};

export const customerPortalAction = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Since createCustomerPortalSession now redirects directly, we don't need to handle the return value
  await createCustomerPortalSession({ userId: user.id });
};
