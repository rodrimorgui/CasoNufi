'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export function Terminal() {
  const [terminalStep, setTerminalStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const terminalSteps = [
    'Consultando SAT... ✔️',
    'SAT: Sin deudas',
    'Consultando INE... ✔️',
    'INE: ****ER',
    'Consultando Buró de Crédito... ✔️',
    'Buró: Score 780',
    'Consultando AML... ✔️',
    'AML: Sin alertas',
    'Background check completado ✅',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTerminalStep((prev) =>
        prev < terminalSteps.length - 1 ? prev + 1 : prev
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [terminalStep]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(terminalSteps.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[420px] rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white font-mono text-sm relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <button
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="space-y-2">
          {terminalSteps.map((step, index) => (
            <div
              key={index}
              className={`${index > terminalStep ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            >
              <span className="text-green-400">$</span> {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup() {
  return (
    <div className="w-[120px] h-[240px] mx-auto rounded-[1.5rem] shadow-xl bg-black relative flex flex-col items-center overflow-hidden border-2 border-gray-200">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-gray-300 rounded-b-xl z-10" />
      {/* Pantalla (mockup) */}
      <div className="flex-1 w-full flex items-center justify-center bg-white mt-3">
        <img src="/nufi.png" alt="Mockup" className="object-contain w-16 h-16 opacity-80" />
      </div>
      {/* Botón home */}
      <div className="w-8 h-1 rounded-full bg-gray-300 mb-2 mt-1" />
    </div>
  );
}
