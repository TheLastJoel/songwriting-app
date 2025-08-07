import type { Metadata } from 'next';
import { Source_Code_Pro } from 'next/font/google';
import './globals.css';
import HeaderBar from '@/components/HeaderBar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';

const sourceCodePro = Source_Code_Pro({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Songwriting Discipline App',
  description: '10 minutes a day to build your songwriting habit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sourceCodePro.className} text-print bg-night min-h-screen`}>
        <AuthProvider>
          <SidebarProvider>
            <Toaster position="top-center" />
            <Sidebar />
            <div className="flex flex-col min-h-screen">
              <HeaderBar />
              <main className="flex-1 p-4 overflow-auto">{children}</main>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}