import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Alisons General Trading LLP — Hastina Motor Parts India',
  description: 'Learn about Alisons General Trading LLP (Hastina Motor Parts), authorized India-based B2B export house for motorcycle, scooter, and tuk-tuk spare parts worldwide.',
  keywords: [
    'about alisons general trading llp',
    'hastina motor parts about',
    'auto parts exporter company new delhi india',
    'motorcycle spare parts export house',
    'tuk tuk parts exporter india',
    'genuine automotive parts sourcing house'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/about',
  },
  openGraph: {
    title: 'About Us | Alisons General Trading LLP — Hastina Motor Parts India',
    description: 'Authorized India-based B2B export specialist for motorcycle, scooter, and tuk-tuk spare parts worldwide.',
    url: 'https://www.hastinamotorparts.in/about',
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
