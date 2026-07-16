import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import DebugConsole from '@/components/DebugConsole';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import { Inter } from 'next/font/google';

// El CSS ya se importa arriba; evitamos que la librería lo inyecte de nuevo
// vía JS en runtime (esa inyección tardía es la causa del ícono gigante
// que parpadea al cargar la página).
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Congreso Nacional de Marketing Politico Colombia',
  description: 'Congreso Nacional de Marketing Politico Colombia',
  'facebook-domain-verification': 'jt2ot27pe1huad2jmb79us4h59gucj',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className + ` min-h-screen`}>
        <DebugConsole />
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
