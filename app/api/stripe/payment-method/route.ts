import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { createClient } from '@/lib/server';

export async function GET(request: NextRequest) {
  try {
    // Obtener usuario autenticado
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ hasPaymentMethod: false }, { status: 401 });
    }

    // Buscar el stripe_customer_id en profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json({ hasPaymentMethod: false });
    }

    // Consultar métodos de pago en Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: profile.stripe_customer_id,
      type: 'card',
    });

    return NextResponse.json({ hasPaymentMethod: paymentMethods.data.length > 0, paymentMethods: paymentMethods.data });
  } catch (err) {
    return NextResponse.json({ hasPaymentMethod: false }, { status: 500 });
  }
} 