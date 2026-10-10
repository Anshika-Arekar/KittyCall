import type { Metadata } from 'next';
import './globals.css';
import { NavigationShell } from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'KittyCall | Y2K Cat Social Network',
  description: 'A Y2K-inspired social matching platform for cats. Swipe. Hype. Meow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F6EEDC] text-[#292631] min-h-screen">
        <NavigationShell>{children}</NavigationShell>
      </body>
    </html>
  );
}
