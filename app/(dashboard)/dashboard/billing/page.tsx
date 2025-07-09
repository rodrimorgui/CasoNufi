'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createClient } from '@/lib/client';

const supabase = createClient();
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentMethodForm({ setHasPaymentMethod }: { setHasPaymentMethod: (v: boolean) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('No se pudo obtener el email del usuario.');

      const res = await fetch('/api/stripe/create-setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const { clientSecret, error } = await res.json();
      if (error) throw new Error(error);

      if (!stripe || !elements) throw new Error('Stripe.js no está listo.');

      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.error) throw new Error(result.error.message || 'Error al guardar el método de pago.');

      setMessage('¡Método de pago guardado correctamente!');
      // Refrescar el estado de hasPaymentMethod
      const check = await fetch('/api/stripe/payment-method', { credentials: 'include' });
      const data = await check.json();
      setHasPaymentMethod(!!data.hasPaymentMethod);
    } catch (err: any) {
      setMessage(err.message || 'Error inesperado');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label htmlFor="card-element">Método de pago</Label>
      <CardElement id="card-element" options={{ hidePostalCode: true }} className="p-2 border rounded" aria-label="Método de pago" />
      <Button type="submit" disabled={saving || !stripe || !elements}>
        {saving ? 'Guardando...' : 'Guardar método de pago'}
      </Button>
      {message && <div className="text-sm mt-2">{message}</div>}
    </form>
  );
}

export default function BillingPage() {
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPaymentMethod() {
      try {
        const res = await fetch('/api/stripe/payment-method', { credentials: 'include' });
        const data = await res.json();
        setHasPaymentMethod(!!data.hasPaymentMethod);
        setPaymentMethods(data.paymentMethods || []);
      } catch {
        setHasPaymentMethod(false);
        setPaymentMethods([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPaymentMethod();
  }, []);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">Billing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Columna izquierda: Métodos de pago */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Métodos de pago configurados</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="mb-4 text-gray-500">Cargando...</div>
              ) : paymentMethods.length > 0 ? (
                <div className="max-h-64 overflow-y-auto pr-2">
                  <ul className="space-y-4">
                    {paymentMethods.map((pm: any) => (
                      <li key={pm.id} className="flex items-center gap-4 border-b pb-2">
                        <span className="font-mono text-sm">**** **** **** {pm.card.last4}</span>
                        <span className="text-xs text-gray-500">Exp: {pm.card.exp_month}/{pm.card.exp_year}</span>
                        <span className="text-xs text-gray-500 uppercase">{pm.card.brand}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mb-4 text-red-600">No tienes métodos de pago guardados.</div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Columna derecha: Status de suscripción */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status de suscripción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <span className="text-gray-700">Plan actual:</span>
                <span className="font-semibold text-[#0743ff]">Gratis</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Formulario para agregar método de pago debajo de la lista */}
      <div className="mt-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Agregar método de pago</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise}>
              <PaymentMethodForm setHasPaymentMethod={setHasPaymentMethod} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 