import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MaintenanceIQ — Issue Tracker',
  description: 'Internal maintenance issue logger and status tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}