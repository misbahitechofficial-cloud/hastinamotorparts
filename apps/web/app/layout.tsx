import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehicleSelectorModal from '@/components/VehicleSelectorModal';
import { EnquiryProvider } from '@/lib/enquiryContext';
import { VehicleProvider } from '@/lib/vehicleContext';

export const metadata: Metadata = {
  title: 'Hastina Motor Parts — Alisons General Trading LLP | Automotive Spare Parts Exporter from India',
  description: 'B2B automotive exporter serving importers, wholesalers, distributors & fleets across the Middle East, Africa, Asia, Europe & South America. Specializing in motorcycles, scooters, tuk-tuks / 3-wheelers, and passenger car parts.',
  keywords: [
    'hastina motor parts',
    'alisons general trading llp',
    'automotive spare parts exporter from india',
    'motorcycle spare parts export india',
    'tuk tuk spare parts',
    'three wheeler parts exporter',
    'suzuki access 125 oem parts',
    'bajaj boxer bm150 spare parts',
    'maruti suzuki car parts exporter'
  ],
  authors: [{ name: 'Alisons General Trading LLP' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hastinamotorparts.in'),
  openGraph: {
    title: 'Hastina Motor Parts — Alisons General Trading LLP | Automotive Spare Parts Exporter from India',
    description: 'B2B automotive exporter serving importers, wholesalers, distributors & fleets across the Middle East, Africa, Asia, Europe & South America.',
    url: 'https://www.hastinamotorparts.in',
    siteName: 'Hastina Motor Parts',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/hastina-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/hastina-icon.svg',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alisons General Trading LLP',
    alternateName: 'Hastina Motor Parts',
    url: 'https://www.hastinamotorparts.in',
    logo: 'https://www.hastinamotorparts.in/hastina-logo.svg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit No. 43, Ground Floor, Living Style Mall, Jasola',
      addressLocality: 'New Delhi',
      postalCode: '110025',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-97178-29768',
      contactType: 'sales',
      email: 'contect@hastinamotorparts.in',
      availableLanguage: ['English', 'Hindi', 'Arabic']
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-[#F8F9FB] text-[#232323] antialiased selection:bg-[#54A5BE]/20 selection:text-[#54A5BE]">
        <EnquiryProvider>
          <VehicleProvider>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <VehicleSelectorModal />
          </VehicleProvider>
        </EnquiryProvider>
      </body>
    </html>
  );
}
