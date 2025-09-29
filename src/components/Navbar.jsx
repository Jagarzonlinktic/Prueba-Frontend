"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Mi App JS
        </Link>
        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
                  <Link href="/me" className="text-gray-600 hover:text-blue-500">Perfil</Link>
                  <span className="text-gray-700">Hola, {user?.name}</span>
                  <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
