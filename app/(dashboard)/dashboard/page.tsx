'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import useSWR from 'swr';
import { Suspense } from 'react';
import { customerPortalAction } from '@/lib/payments/actions';

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SubscriptionSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
    </Card>
  );
}

function ManageSubscription() {
  // Elimina cualquier referencia a teamData
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <form action={customerPortalAction}>
            <Button type="submit" variant="outline">
              Manage Subscription
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function BillingSection() {
  // Aquí va la lógica para obtener el método de pago desde Stripe vía API propia
  // y mostrar el formulario para agregar uno si no existe.
  // Por ahora, placeholder:
  // TODO: Reemplazar fetcher y endpoints por los reales de tu backend/api
  const { data: paymentMethods, isLoading } = useSWR('/api/stripe/payment-method', fetcher);

  if (isLoading) {
    return <Card className="mb-8"><CardHeader><CardTitle>Billing</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
  }

  const hasPaymentMethod = paymentMethods && paymentMethods.length > 0;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
      </CardHeader>
      <CardContent>
        {hasPaymentMethod ? (
          <div className="space-y-2">
            <p className="text-green-600 font-medium">You have a payment method on file.</p>
            {/* Aquí puedes mostrar detalles del método de pago si lo deseas */}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-orange-600 font-medium">No payment method found.</p>
            {/* Aquí va el formulario para agregar método de pago */}
            <AddPaymentMethodForm />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente placeholder para agregar método de pago
function AddPaymentMethodForm() {
  // Aquí va la integración real con Stripe Elements o tu flujo de setup intent
  return (
    <form /* onSubmit={} */ className="space-y-4">
      <Button type="submit" className="w-full">Add Payment Method</Button>
    </form>
  );
}

export default function SettingsPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Settings</h1>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <ManageSubscription />
      </Suspense>
      <BillingSection />
    </section>
  );
}
