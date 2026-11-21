import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products & Spare Parts Catalogue | Hastina Motor Parts',
  description: 'Explore 19,000+ automotive spare parts across Engine, Brake, Transmission, Suspension & Electrical components for motorcycles, scooters, and 3-wheelers.',
  keywords: [
    'automotive spare parts catalogue',
    'motorcycle engine components',
    'scooter brake pads discs',
    'tuk tuk transmission parts india',
    'two wheeler spare parts wholesale',
    'genuine oem motorcycle parts export'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/products',
  },
  openGraph: {
    title: 'Products & Spare Parts Catalogue | Hastina Motor Parts',
    description: 'Explore 19,000+ automotive spare parts across Engine, Brake, Transmission, Suspension & Electrical components.',
    url: 'https://www.hastinamotorparts.in/products',
  }
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
