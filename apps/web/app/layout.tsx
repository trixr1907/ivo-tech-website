import type { Metadata } from 'next';
import './globals.css';
import { VercelAnalytics } from '../components/analytics/VercelAnalytics';

export const metadata: Metadata = {
  title: 'IVO-TECH | Innovative Technologielösungen',
  description:
    'Moderne Webanwendungen, 3D-Druck Services und innovative API-Entwicklung. Ihr Partner für zukunftsorientierte Technologielösungen.',
  keywords: ['Webentwicklung', 'Next.js', '3D-Druck', 'API-Entwicklung', 'TypeScript', 'React'],
  authors: [{ name: 'IVO-TECH Team' }],
  creator: 'IVO-TECH',
  publisher: 'IVO-TECH',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://ivo-tech.com',
    title: 'IVO-TECH | Innovative Technologielösungen',
    description: 'Moderne Webanwendungen, 3D-Druck Services und innovative API-Entwicklung.',
    siteName: 'IVO-TECH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IVO-TECH | Innovative Technologielösungen',
    description: 'Moderne Webanwendungen, 3D-Druck Services und innovative API-Entwicklung.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1f2937',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='de'>
      <body className='bg-gray-900 text-white antialiased'>
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
