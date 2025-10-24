import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
//import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Providers from './providers';


export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Sistema de gestión de catálogo de productos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}