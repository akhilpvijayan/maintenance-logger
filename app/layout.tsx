import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MaintenanceIQ — Issue Tracker',
  description: 'Internal maintenance issue logger and status tracker',
};

import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}