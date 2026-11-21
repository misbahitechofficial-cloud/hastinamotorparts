import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OEM Spare Parts Exploded Diagrams & Catalogue | Hastina Motor Parts',
  description: 'Search official OEM diagrams, assemblies, and part numbers for Suzuki, Bajaj, Aprilia, Vespa, and Yamaha two-wheelers and three-wheelers.',
  keywords: [
    'oem exploded diagrams',
    'motorcycle parts catalogue with diagram',
    'bajaj re 4s parts diagram',
    'suzuki access parts catalogue',
    'vespa exploded view spare parts',
    'motorcycle technical drawing schematics'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/catalogue',
  },
  openGraph: {
    title: 'OEM Spare Parts Exploded Diagrams & Catalogue | Hastina Motor Parts',
    description: 'Search official OEM diagrams, assemblies, and part numbers for Suzuki, Bajaj, Aprilia, Vespa, and Yamaha.',
    url: 'https://www.hastinamotorparts.in/catalogue',
  }
};

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
