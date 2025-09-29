"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
// 1. IMPORTAMOS el nuevo componente que creaste
import { MSWComponent } from '@/components/MSWComponent';

const inter = Inter({ subsets: ['latin'] });

// 2. HEMOS QUITADO el bloque "if (typeof window...)" de aquí para siempre.

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 3. AÑADIMOS el nuevo componente aquí. No se verá nada en la página. */}
        <MSWComponent /> 
        
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto p-4">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

