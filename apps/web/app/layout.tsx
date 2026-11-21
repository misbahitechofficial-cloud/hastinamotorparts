import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehicleSelectorModal from '@/components/VehicleSelectorModal';
import { EnquiryProvider } from '@/lib/enquiryContext';
import { VehicleProvider } from '@/lib/vehicleContext';

export const metadata: Metadata = {
  title: {
    default: 'Hastina Motor Parts — Alisons General Trading LLP | Automotive Spare Parts Exporter from India',
    template: '%s | Hastina Motor Parts'
  },
  description: 'Premier India-based B2B automotive spare parts exporter serving importers, wholesalers & fleets across UAE, Middle East, Africa, Asia, Europe & Latin America. Supplying genuine OEM & aftermarket parts for motorcycles, scooters, tuk-tuks / 3-wheelers, and passenger cars.',
  keywords: [
    'hastina motor parts',
    'alisons general trading llp',
    'automotive spare parts exporter from india',
    'motorcycle spare parts export india',
    'tuk tuk spare parts exporter',
    'three wheeler parts export',
    'bajaj re 4s 4 stroke spare parts',
    'suzuki access 125 oem parts',
    'bajaj boxer bm150 spare parts wholesale',
    'suzuki gixxer 150 250 sf parts',
    'suzuki burgman street 125 spares',
    'vespa vxl 125 150 parts export',
    'aprilia sr 125 150 storm parts',
    'yamaha ray 115 spare parts',
    'motorcycle cylinder piston kit india',
    'two wheeler spare parts wholesale supplier',
    'genuine oem spare parts exporter delhi',
    'auto parts exporter to uae dubai africa'
  ],
  authors: [{ name: 'Alisons General Trading LLP', url: 'https://www.hastinamotorparts.in' }],
  creator: 'Misbahi Tech',
  publisher: 'Alisons General Trading LLP',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hastinamotorparts.in'),
  alternates: {
    canonical: 'https://www.hastinamotorparts.in',
  },
  openGraph: {
    title: 'Hastina Motor Parts — Alisons General Trading LLP | Automotive Spare Parts Exporter from India',
    description: 'Premier India-based B2B automotive spare parts exporter serving importers, wholesalers & fleets across UAE, Middle East, Africa, Asia, Europe & Latin America.',
    url: 'https://www.hastinamotorparts.in',
    siteName: 'Hastina Motor Parts',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/hastina-hero-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Hastina Motor Parts — Alisons General Trading LLP India'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hastina Motor Parts — Automotive Spare Parts Exporter India',
    description: 'B2B exporter for motorcycle, scooter, and 3-wheeler (tuk-tuk) spare parts from India.',
    images: ['/images/hastina-hero-banner.jpg']
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'AutoPartsStore', 'WholesaleStore'],
        '@id': 'https://www.hastinamotorparts.in/#organization',
        name: 'Hastina Motor Parts — Alisons General Trading LLP',
        alternateName: ['Hastina Motor Parts', 'Alisons General Trading LLP'],
        url: 'https://www.hastinamotorparts.in',
        logo: 'https://www.hastinamotorparts.in/hastina-logo.svg',
        image: 'https://www.hastinamotorparts.in/images/hastina-hero-banner.jpg',
        description: 'Premier India-based B2B automotive spare parts exporter specializing in OEM & aftermarket components for motorcycles, scooters, tuk-tuks (3-wheelers), and passenger cars.',
        telephone: '+91-97178-29768',
        email: 'contect@hastinamotorparts.in',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Unit No. 43, Ground Floor, Living Style Mall, Jasola',
          addressLocality: 'New Delhi',
          addressRegion: 'Delhi',
          postalCode: '110025',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '28.5397',
          longitude: '77.2882'
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '19:00'
          }
        ],
        areaServed: [
          { '@type': 'Place', name: 'Global' },
          { '@type': 'Place', name: 'United Arab Emirates' },
          { '@type': 'Place', name: 'Saudi Arabia' },
          { '@type': 'Place', name: 'Iraq' },
          { '@type': 'Place', name: 'Egypt' },
          { '@type': 'Place', name: 'Nigeria' },
          { '@type': 'Place', name: 'Ghana' },
          { '@type': 'Place', name: 'Kenya' },
          { '@type': 'Place', name: 'Sri Lanka' },
          { '@type': 'Place', name: 'Bangladesh' },
          { '@type': 'Place', name: 'Latin America' }
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-97178-29768',
          contactType: 'sales',
          email: 'contect@hastinamotorparts.in',
          availableLanguage: ['English', 'Hindi', 'Arabic']
        },
        sameAs: [
          'https://misbahitech.in/'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.hastinamotorparts.in/#website',
        url: 'https://www.hastinamotorparts.in',
        name: 'Hastina Motor Parts',
        publisher: { '@id': 'https://www.hastinamotorparts.in/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.hastinamotorparts.in/products?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
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
