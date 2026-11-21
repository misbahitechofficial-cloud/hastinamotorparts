import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automotive Brands & Models | Suzuki, Bajaj, Vespa, Aprilia, Yamaha Spares',
  description: 'Browse genuine OEM and aftermarket spare parts by manufacturer: Bajaj RE 4S, Boxer BM150, Suzuki Access, Gixxer, Burgman, Vespa, and Aprilia.',
  keywords: [
    'suzuki genuine parts exporter india',
    'bajaj spare parts wholesale',
    'vespa scooter parts export',
    'aprilia sr 125 150 spares',
    'yamaha ray scooter spare parts',
    'bajaj re 4 stroke auto rickshaw parts'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/brands',
  },
  openGraph: {
    title: 'Automotive Brands & Models | Suzuki, Bajaj, Vespa, Aprilia, Yamaha Spares',
    description: 'Browse genuine OEM and aftermarket spare parts by manufacturer.',
    url: 'https://www.hastinamotorparts.in/brands',
  }
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
