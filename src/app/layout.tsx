import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: 'Chef Irfan Malik — Professional Chef & Recipe Creator',
    template: '%s | Chef Irfan Malik',
  },
  description: 'Discover carefully crafted recipes, professional culinary techniques and the experience behind every dish by Chef Irfan Malik.',
  keywords: ['Chef Irfan Malik', 'Pakistani recipes', 'premium recipes', 'professional chef', 'culinary', 'cooking'],
  authors: [{ name: 'Chef Irfan Malik' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Chef Irfan Malik',
    title: 'Chef Irfan Malik — Professional Chef & Recipe Creator',
    description: 'Discover carefully crafted recipes, professional culinary techniques and the experience behind every dish.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chef Irfan Malik — Professional Chef & Recipe Creator',
    description: 'Discover carefully crafted recipes, professional culinary techniques and the experience behind every dish.',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
