"use client";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Este es el "Guardia de Seguridad" del lado del cliente.
// Se asegura de que solo usuarios autenticados puedan ver el contenido
// de las páginas que protege (dashboard, me, etc.).
export default function ProtectedLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si la carga inicial ha terminado y el usuario NO está autenticado...
    if (!isLoading && !isAuthenticated) {
      // ...lo redirigimos a la página de login.
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Mientras se verifica la sesión o si el usuario no está autenticado,
  // mostramos un mensaje de "Cargando...".
  // Esto previene que se vea el contenido protegido por un instante.
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Cargando...</div>
      </div>
    );
  }

  // Si la verificación pasa, simplemente muestra el contenido de la página solicitada.
  return children;
}

