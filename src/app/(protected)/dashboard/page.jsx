"use client";
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-4xl font-bold text-gray-800">
        ¡Bienvenido!
      </h1>
      <p className="mt-4 text-xl text-gray-600">
        Nos alegra verte de nuevo, <span className="font-semibold text-blue-600">{user?.name}</span>.
      </p>
      <p className="mt-2 text-gray-500">
        Has iniciado sesión correctamente.
      </p>
    </div>
  );
}

