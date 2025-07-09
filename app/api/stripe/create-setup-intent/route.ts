import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { createClient } from '@/lib/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Buscar cliente en Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];

    // Si no existe, crear cliente en Stripe
    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    // Actualizar el stripe_customer_id en la tabla profiles de Supabase
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('email', email);
    if (updateError) {
      return NextResponse.json({ error: 'Error updating profile with Stripe customer ID' }, { status: 500 });
    }

    // Crear SetupIntent para el cliente
    const setupIntent = await stripe.setupIntents.create({ customer: customer.id });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 