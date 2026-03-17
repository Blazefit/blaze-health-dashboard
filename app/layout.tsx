import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ClerkProvider } from '@clerk/nextjs';
import { DemoProvider } from '@/hooks/useDemo';
import { Sidebar } from '@/components/layout/Sidebar';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Blaze Health',
  description: 'Personal health intelligence dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950`}
        >
          <DemoProvider>
            <Sidebar />
            <main className="ml-16 md:ml-64 min-h-screen transition-all">
              {children}
            </main>
          </DemoProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
