import type { Metadata } from 'next';
import localFont from 'next/font/local';
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

// Conditionally import ClerkProvider only when keys are configured
let ClerkProvider: React.ComponentType<{ children: React.ReactNode }> | null = null;
if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ClerkProvider = require('@clerk/nextjs').ClerkProvider;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: 'var(--background)' }}
      >
        <DemoProvider>
          <Sidebar />
          <main className="ml-[68px] min-h-screen transition-all">
            {children}
          </main>
        </DemoProvider>
      </body>
    </html>
  );

  if (ClerkProvider) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
