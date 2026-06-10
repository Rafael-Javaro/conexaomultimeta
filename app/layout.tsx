import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MultiMeta Admin Dashboard',
  description: 'Painel operacional para monitoramento da plataforma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
