'use client';

import { useEffect } from 'react';

// Este componente no renderiza nada en la UI.
// Su único propósito es iniciar el Mock Service Worker
// de una manera segura y exclusiva para el cliente.
export function MSWComponent() {
  useEffect(() => {
    // La lógica se mueve aquí, dentro de un useEffect.
    // Esto garantiza que se ejecute solo en el navegador.
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const { worker } = require('@/mocks/browser');
      worker.start();
    }
  }, []); // El array vacío asegura que se ejecute solo una vez.

  return null; // No dibuja nada en la pantalla
}

