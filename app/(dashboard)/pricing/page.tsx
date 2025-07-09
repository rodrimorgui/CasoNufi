
import { createClient } from '@/lib/server';
import { Check } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

export default async function PricingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data?.user;

  const plans = [
    {
      name: 'Base',
      id: 'base',
      price: 5000,
      features: [
        'Validación básica',
        'Integraciones esenciales',
        'Dashboard de actividad',
      ],
    },
    {
      name: 'Plus',
      id: 'plus',
      price: 20000,
      features: [
        'APIs avanzadas',
        'Flujos automatizados',
        'Soporte técnico',
      ],
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <form className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        {plans.map((plan) => (
          <label
            key={plan.id}
            htmlFor={plan.id}
            className="group block pt-6 rounded-2xl border transition-all cursor-pointer shadow-sm border-gray-200 bg-white hover:border-[#0743ff]/60 focus-within:border-[#0743ff] focus-within:ring-2 focus-within:ring-[#0743ff]"
          >
            <input
              type="radio"
              id={plan.id}
              name="priceId"
              value={plan.id}
              className="peer hidden"
              required
            />
            <div className="peer-checked:border-[#0743ff] peer-checked:ring-2 peer-checked:ring-[#0743ff] peer-checked:bg-blue-50 border rounded-2xl p-4 transition-all">
              <h2 className="text-2xl font-medium text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-sm text-gray-600 mb-4">Prueba gratuita por 7 días</p>
              <p className="text-4xl font-medium text-gray-900 mb-6">
                {plan.name === 'Base' ? '$50' : '$200'}{' '}
                <span className="text-xl font-normal text-gray-600">MXN/mes</span>
              </p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#0743ff' }} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </label>
        ))}
        <div className="md:col-span-2 flex justify-center mt-4">
          {isLoggedIn ? (
            <Link href="/dashboard/billing">
              <button
                type="button"
                className="w-full rounded-full bg-white text-[#0743ff] border border-[#0743ff] transition-colors duration-200 hover:bg-[#0743ff] hover:text-white hover:border-[#0743ff] px-8 py-3 text-lg font-semibold flex items-center justify-center"
              >
                Lo quiero
              </button>
            </Link>
          ) : (
            <Link href="/auth/sign-up">
              <button
                type="button"
                className="w-full rounded-full bg-white text-[#0743ff] border border-[#0743ff] transition-colors duration-200 hover:bg-[#0743ff] hover:text-white hover:border-[#0743ff] px-8 py-3 text-lg font-semibold flex items-center justify-center"
              >
                Lo quiero
              </button>
            </Link>
          )}
        </div>
      </form>
    </main>
  );
}
